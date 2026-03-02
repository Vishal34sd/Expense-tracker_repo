import User from "../model/userSchema.js";
import { otpGenerator } from "../utils/otp.js";
import { sendEmail } from "../utils/nodeMailerConfig.js";

 const resendOtp = async (req, res) => {
  try {
    const email = req.userInfo.email ;


    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = otpGenerator();

    user.otp = otp;
    user.expiresIn = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(email, otp);

    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { resendOtp} ;
