import { z } from "zod";

export const usernameSchema = z.string().min(6).max(255).trim();

export const passwordSchema = z
  .string()
  .min(6)
  .max(255)
  .regex(
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    "Nie prawidłowe hasło",
  )
  .trim();
