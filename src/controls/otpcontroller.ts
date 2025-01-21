import { PrismaClient } from "@prisma/client";
import { generateOTP } from "../utils/otp.utls";
import { sendEmail } from "../utils/email.utils";
import { Request, Response } from "express";
import { isOTPExpired } from "../utils/otp.utls";

const prisma = new PrismaClient()
export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body; // Getting email from the frontend
  
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }
  
    try {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      // If the user exists, generate the OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  
      await prisma.user.update({
        where: { email },
        data: { otp, otpExpiry },
      });
  
      const message = `
        Hello,
        
        Here is your OTP for password reset: ${otp}
  
        Please note that this OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.
  
        Thank you,
        Your App Team
      `;
  
      await sendEmail(email, "Password Reset OTP", message);
  
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error in forgetPassword:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  };

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         res.status(404).json({ message: "User not found." });
          return;
        }
  
      if (!user.otp || isOTPExpired(user.otpExpiry as Date)) {
        res.status(400).json({ message: "OTP expired or invalid." });
        return
      }
       
  
      if (user.otp !== otp) {
         res.status(400).json({ message: "Invalid OTP." });
         return
      }
  
       res.json({ message: "OTP verified. You can reset your password now." });
       return
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
      return 
    }
  };
  
  export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, newPassword } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ message: "User not found." });
      return
      }
  
      await prisma.user.update({
        where: { email },
        data: { password: newPassword, otp: null, otpExpiry: null },
      });
  
       res.json({ message: "Password reset successful." });
       return
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
      return 
    }
  };