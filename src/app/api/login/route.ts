import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/auth";
import { authenticateUserFunction } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    // Call the stored procedure
    const user = await authenticateUserFunction({
      phone: validatedData.phone,
      password: validatedData.password
    });
    
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
        
    let hasil = NextResponse.json(user);
    return hasil;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}