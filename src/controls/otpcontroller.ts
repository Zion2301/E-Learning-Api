import { PrismaClient } from "@prisma/client";
import { generateOTP } from "../utils/otp.utls";
import { sendEmail } from "../utils/email.utils";
import { hashPassword, comparePassword } from "../utils/password.util"; // For password hashing and comparison
import { Request, Response } from "express";
import { isOTPExpired } from "../utils/otp.utls";

const prisma = new PrismaClient();

export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

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
      Team Zion.
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
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP." });
      return;
    }

    res.json({ message: "OTP verified. You can reset your password now." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res.status(400).json({ message: "Email and new password are required." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { PasswordHistory: { orderBy: { createdAt: "desc" }, take: 5 } },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Check if the new password matches any of the last 5 passwords
    for (const history of user.PasswordHistory) {
      const isMatch = await comparePassword(newPassword, history.passwordHash);
      if (isMatch) {
        res.status(400).json({ message: "The new password matches one of your last 5 passwords. Please use a different password." });
        return;
      }
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Use a transaction to update the password and add to password history atomically
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashedPassword, otp: null, otpExpiry: null },
      }),
      prisma.passwordHistory.create({
        data: { userId: user.id, passwordHash: hashedPassword },
      }),
    ]);

    res.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};