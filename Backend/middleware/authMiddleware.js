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
        console.log(err);
        return res.status(403).json({
            success: false,
            message: "Access denied"
        });
    }
}

export default authMiddleware;
