import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const sendEmail = async (email , otp) => { 
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "OTP for Email Verification",
    text:`Welcome to our Expense Tracker Website !\n
    The OTP for Email Verification is ${otp} . It is only valid for 5 minutes .\n
    Thanks for registering on our website`, 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    
  }
};

export { sendEmail };
