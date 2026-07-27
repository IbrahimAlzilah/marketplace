export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type AuthModalStep = "login" | "register" | "forgot-password" | "otp" | "reset-password";
