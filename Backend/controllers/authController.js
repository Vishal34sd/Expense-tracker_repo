import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { otpGenerator } from "../utils/otp.js";
import { sendEmail } from "../utils/nodeMailerConfig.js";

const userRegister = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (username, email, password) are required"
      });
    }

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
      password: hashedPassword
    });

     const  savedUser = await newUser.save();

    if (!savedUser) {
      return res.status(400).json({
        success: false,
        message: "User registration failed"
      });
    }
     // Creation of otp and saving it to DataBase
    const otp = otpGenerator();
    await sendEmail(email , otp);
    savedUser.otp = otp ;
    savedUser.expiresIn = Date.now() + 1*60*1000 ; // otp expires in 5min
    await savedUser.save();

    const accessToken = await jwt.sign({
      userId : savedUser._id ,
      username :  savedUser.username,
      email :  savedUser.email,
    }, process.env.JWT_SECRET_KEY, {expiresIn : "30m"});

    if(!accessToken){
      return res.status(401).json({
        success : false ,
        message : "access token cannot be created"
      })
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data : savedUser,
      token : accessToken
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const userLogin = async(req , res)=>{
  try{
    const {email , password} = req.body ;
    const emailExist = await User.findOne({email});
    if(!emailExist){
      return res.status(400).json({
        success : false ,
        message : "Email doesn't exist"
      });
    }
    const matchPassword = await bcrypt.compare(password , emailExist.password);
    if(!matchPassword){
      return res.status(401).json({
        success : false ,
        message : "Password is incorrect"
      })
    }

    if (!emailExist.isVerified) {
      return res.status(403).json({ msg: "Please verify your email first" });
    }

    const accessToken = await jwt.sign({
      userId : emailExist._id ,
      username : emailExist.username,
      email : emailExist.email
    

    }, process.env.JWT_SECRET_KEY, {expiresIn : "30m"});
    
    if(!accessToken){
      return res.status(400).json({
        success : false , 
        message : "Login failed"
      })
    }

    return res.status(200).json({
      success : true ,
      message : "Login successfull",
      token : accessToken,
      
    })

  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success : false ,
      message : "Something went wrong"
    })
  }
}
const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required"
      });
    }

    const userEmail = await User.findOne({ email: req.userInfo.email });

    if (!userEmail) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    if (userEmail.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (userEmail.expiresIn < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    userEmail.otp = null;
    userEmail.expiresIn = null;
    userEmail.isVerified = true
    await userEmail.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const changePassword = async(req, res)=>{
  const userId = req.userInfo.userId ;
  const {oldPassword , newPassword} = req.body;
  const userExist = await User.findById(userId);
  if(!userExist){
    return res.status(404).json({
      success : false ,
      message : "User not exist"
    })
  }

  const comparePassword = await bcrypt.compare(oldPassword , userExist.password);
  if(!comparePassword){
    return res.status(400).json({
      success : false , 
      message : "Wrong password provided! Please try again ."
    })
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword , salt);

  userExist.password = hashedPassword;
  const savedUser = await userExist.save();
  if(!savedUser){
    return res.status(400).json({
      success : false ,
      message : "Sorry ! something went wrong"
    })
  }
  return res.status(200).json({
    success : true ,
    message : "Password changed successfully"
  })
  
}

export { userRegister , userLogin , verifyOTP, changePassword};
