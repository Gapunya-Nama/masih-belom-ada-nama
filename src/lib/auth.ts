import { z } from "zod";
import { AuthCombined } from "./dataType/interfaces";

export const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^(?:\+?[1-9]\d{1,14}|0\d{9,14})$/, "Phone number must be in E.164 format (e.g., +1234567890) or start with 0"),
  password: z
    .string()
    .min(2, "Password must be at least 2 characters")
    .regex(/^[a-zA-Z0-9\s]*$/, "Password must contain only letters, numbers, and spaces")
});

export type LoginInput = z.infer<typeof loginSchema>;

export const authenticateUser = async (
  credentials: LoginInput
): Promise<AuthCombined> => {
  try {

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),  
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid credentials');
    }


    const user = await response.json();

    console.log("Ini adalah respons server untuk user: ",user);


    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as AuthCombined;

  } catch (error) {
    console.error("Authentication error:", error); 
    throw error; 
  }
};

