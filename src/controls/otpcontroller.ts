import { PrismaClient } from "@prisma/client";
import { generateOTP } from "../utils/otp.utls";
import { sendEmail } from "../utils/email.utils";
import { Request, Response } from "express";
import { isOTPExpired } from "../utils/otp.utls";

const prisma = new PrismaClient()
export const forgetPassword = async (req:Request, res: Response) => {
    const { email } = req.body;//getting email from the frontend

    if (!email) {
        return res.status(200).json({ message: "Email is required "});
    }

    try {
        //check if the user exists
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if (!user) {
            res.status(404).json({message: "User not found"})
        }

        //if the user exists, generate the otp type shiiiii
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: {otp, otpExpiry}
        })

        const message = `
      Hello,
      
      Here is your OTP for password reset: ${otp}

      Please note that this OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.

      Thank you,
      Your App Team
    `;

    await sendEmail(email, "Password Reset OTP", message);
    return res.status(200).json({ message: "Sent succssfully"})
    } catch (error) {
        return res.status(500).json({ message: "An error occured"})
    }
}

export const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found." });
  
      if (!user.otp || isOTPExpired(user.otpExpiry as Date))
        return res.status(400).json({ message: "OTP expired or invalid." });
  
      if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });
  
      return res.json({ message: "OTP verified. You can reset your password now." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  };
  
  export const resetPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found." });
  
      await prisma.user.update({
        where: { email },
        data: { password: newPassword, otp: null, otpExpiry: null },
      });
  
      return res.json({ message: "Password reset successful." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  };