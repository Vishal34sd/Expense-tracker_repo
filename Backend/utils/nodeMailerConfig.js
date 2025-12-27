import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend .env explicitly so EMAIL_USER / EMAIL_PASS are always available
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("[MAIL DEBUG] EMAIL_USER from env:", process.env.EMAIL_USER || "<not set>");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transport configuration on startup
transporter
  .verify()
  .then(() => {
    console.log("[MAIL DEBUG] SMTP connection verified successfully.");
  })
  .catch((error) => {
    console.error("[MAIL DEBUG] SMTP verification failed:", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      response: error?.response,
    });
  });

const sendEmail = async (email , otp) => { 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP for Email Verification",
    text:`Welcome to our Expense Tracker Website !\n
    The OTP for Email Verification is ${otp} . It is only valid for 5 minutes .\n
    Thanks for registering on our website`, 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[MAIL DEBUG] Email sent successfully", {
      response: info?.response,
      messageId: info?.messageId,
      accepted: info?.accepted,
      rejected: info?.rejected,
    });
  } catch (error) {
    console.error("[MAIL DEBUG] Error sending email", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      response: error?.response,
    });
    
  }
};

export { sendEmail };
