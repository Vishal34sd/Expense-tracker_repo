import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isHttps = (req) =>
  req?.secure ||
  req?.headers?.["x-forwarded-proto"] === "https" ||
  process.env.NODE_ENV === "production";

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedTokenInfo;

    // Sliding / Rolling session:
    // As long as the user makes requests within 30 minutes, keep them active.
    // If less than 25 minutes remain (at least 5 min elapsed since last token), refresh the session.
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decodedTokenInfo.exp - currentTime;

    if (timeLeft < 25 * 60) {
      const refreshedToken = jwt.sign(
        {
          userId: decodedTokenInfo.userId,
          username: decodedTokenInfo.username,
          email: decodedTokenInfo.email,
          role: decodedTokenInfo.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30m" }
      );

      const secure = isHttps(req);
      res.cookie("accessToken", refreshedToken, {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        maxAge: 30 * 60 * 1000, // 30 minutes
      });
    }

    next();
  } catch (err) {
    const isExpired = err?.name === "TokenExpiredError";
    return res.status(401).json({
      success: false,
      message: isExpired
        ? "Session expired due to 30 minutes of inactivity. Please login again."
        : "Invalid token. Please login again.",
    });
  }
};

export default authMiddleware;
