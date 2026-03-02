import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend .env explicitly so EMAIL_USER / EMAIL_PASS are always available
dotenv.config({ path: path.join(__dirname, "../.env") });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export { sendEmail };
