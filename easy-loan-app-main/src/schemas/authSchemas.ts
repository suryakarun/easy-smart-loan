
import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

export const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits" })
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
