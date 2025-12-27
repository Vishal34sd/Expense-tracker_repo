import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
    const headerData = req.headers["authorization"];
    const token = headerData && headerData.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        });
    }

    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = decodedTokenInfo;
        next();
    } catch (err) {
        const isExpired = err?.name === "TokenExpiredError";
        return res.status(401).json({
            success: false,
            message: isExpired ? "Token expired. Please login again." : "Invalid token. Please login again."
        });
    }
}

export default authMiddleware;
