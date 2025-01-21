import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import twilio from "twilio";
import { generateOTP } from "../utils/otp.utls";
import { isValidPhoneNumber } from "../utils/phoneNumber.utils";

const prisma = new PrismaClient();
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendPhoneOTP = async (req: Request, res: Response): Promise<void> => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
     res.status(400).json({ message: "Phone number is required" });
     return
  }

  // Validate international phone number format (using libphonenumber or custom regex)
  if (!isValidPhoneNumber(phoneNumber)) {
     res.status(400).json({ message: "Invalid phone number format" });
     return
  }

  try {
    // Generate OTP and expiry time
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Save OTP and expiry to the database (you could also associate it with a user)
    const user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return
    }

    // Update user with OTP and OTP expiry
    await prisma.user.update({
      where: { phoneNumber },
      data: { otp, otpExpiry },
    });

    // Send OTP via Twilio SMS (adjusting country code as needed)
    const message = await twilioClient.messages.create({
      body: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
      to: phoneNumber, // Ensure phone number is in international format
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
    });

    res.status(200).json({ message: "OTP sent successfully" });
    return
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: "An error occurred" });
     return
  }
};

// Helper function to verify OTP (to be called after user submits OTP)
export const verifyPhoneOTP = async (req: Request, res: Response): Promise<void> => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
     res.status(400).json({ message: "Phone number and OTP are required" });
     return
  }

  try {
    // Check if user exists and OTP matches
    const user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (!user) {
     res.status(404).json({ message: "User not found" });
     return 
    }

    if (user.otp !== otp) {
       res.status(400).json({ message: "Invalid OTP" });
       return
    }

    // Check if OTP has expired
    if (!user.otpExpiry) {
         res.status(400).json({ message: "OTP has expired or is invalid" });
         return
      }

    const now = new Date();
    if (user.otpExpiry < now) {
       res.status(400).json({ message: "OTP has expired" });
       return
    }

    // OTP is valid, proceed to password reset or other actions
     res.status(200).json({ message: "OTP verified successfully" });
     return
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: "An error occurred" });
     return
  }
};