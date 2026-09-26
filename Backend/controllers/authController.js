import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import { hashPassword } from "../utils/hashPassword.js"
import crypto from "crypto"

const userRegister = async (req, res) => {
  try {
    let { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (username, email, password) are required"
      });
    }

    username = String(username).trim();
    email = String(email).trim().toLowerCase();

    const userExists = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message:
          userExists.username === username
            ? "Username already taken"
            : "Email already registered"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: avatar || "avatar1",
      isEmailVerified: true
    });

    const savedUser = await newUser.save();

    const accessToken = jwt.sign(
      {
        userId: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Registration successful",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        avatar: savedUser.avatar || "avatar1",
      }
    });

  } catch (err) {
    console.error("Error in userRegister:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error"
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const emailExist = await User.findOne({ email: normalizedEmail });
    if (!emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email doesn't exist"
      });
    }
    const matchPassword = await bcrypt.compare(password, emailExist.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect"
      });
    }

    const accessToken = jwt.sign(
      {
        userId: emailExist._id,
        username: emailExist.username,
        email: emailExist.email
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: emailExist._id,
        username: emailExist.username,
        email: emailExist.email,
        avatar: emailExist.avatar || "avatar1",
      }
    });

  } catch (err) {
    console.error("Error in userLogin:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong"
    });
  }
};


const changePassword = async (req, res) => {
  const userId = req.userInfo.userId;
  const { oldPassword, newPassword } = req.body;
  const userExist = await User.findById(userId);
  if (!userExist) {
    return res.status(404).json({
      success: false,
      message: "User not exist"
    })
  }

  const comparePassword = await bcrypt.compare(oldPassword, userExist.password);
  if (!comparePassword) {
    return res.status(400).json({
      success: false,
      message: "Wrong password provided! Please try again ."
    })
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  userExist.password = hashedPassword;
  const savedUser = await userExist.save();
  if (!savedUser) {
    return res.status(400).json({
      success: false,
      message: "Sorry ! something went wrong"
    })
  }
  return res.status(200).json({
    success: true,
    message: "Password changed successfully"
  })

}

const userLogout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google clientId, clientSecret, or redirectUri not provided in environment variables");
  }

  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

export const googleStartAuthHandler = async (req, res) => {
  try {
    const client = getGoogleClient();

    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    return res.redirect(url);
  }
  catch (err) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }

}

const googleAuthCallbackHandler = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(401).json({
      message: "Google code is not provided",
    });
  }

  try {
    const client = getGoogleClient();
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.status(400).json({
        message: "No google id_token present",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload?.email;
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified) {
      return res.status(400).json({
        message: "Email is not verified",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const derivedUsername =
      payload?.name && String(payload.name).trim()
        ? String(payload.name).trim()
        : normalizedEmail.split("@")[0];

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      user = await User.create({
        username: derivedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        isEmailVerified: true,
      });
    } else {
      if (!user.username) user.username = derivedUsername;
      if (!user.password) {
        const randomPassword = crypto.randomBytes(16).toString("hex");
        user.password = await hashPassword(randomPassword);
      }
      if (!user.isEmailVerified) user.isEmailVerified = true;
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });

    const frontendUrl = (
      process.env.FRONTEND_URL || "https://expense-tracker-repo-3p8w.vercel.app"
    ).replace(/\/$/, "");

    return res.redirect(`${frontendUrl}/dashboard`);
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userInfo.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || "avatar1",
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const updateData = {};
    if (username) updateData.username = String(username).trim();
    if (avatar) updateData.avatar = String(avatar).trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.userInfo.userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar || "avatar1",
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update profile",
    });
  }
};

export {
  userRegister,
  userLogin,
  changePassword,
  googleAuthCallbackHandler,
  userLogout,
  getProfile,
  updateProfile,
};
