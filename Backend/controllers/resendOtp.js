// Deprecated: OTP flow removed
export const resendOtp = async (req, res) => {
  return res.status(410).json({ success: false, message: "OTP verification has been disabled." });
};
