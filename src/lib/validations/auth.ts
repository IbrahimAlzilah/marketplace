import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(9, "Enter a valid mobile number")
    .regex(/^5\d{8}$/, "Mobile must start with 5 and be 9 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    phone: z
      .string()
      .min(9, "Enter a valid mobile number")
      .regex(/^5\d{8}$/, "Mobile must start with 5 and be 9 digits"),
    nationalId: z
      .string()
      .length(10, "National ID must be exactly 10 digits")
      .regex(/^[12]\d{9}$/, "National ID must start with 1 or 2"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v, "You must accept the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code"),
});

export const forgotPasswordSchema = z.object({
  phone: z
    .string()
    .min(9, "Enter a valid mobile number")
    .regex(/^5\d{8}$/, "Mobile must start with 5 and be 9 digits"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });



export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type OtpForm = z.infer<typeof otpSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

