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
    subject: "Login OTP",
    text: `The OTP for Login in our Expense Traker Website is ${otp} . It is only valid for 5 minutes .`, 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    
  }
};

export { sendEmail };
