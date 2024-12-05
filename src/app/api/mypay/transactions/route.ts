import { NextResponse } from "next/server";
import { getUserMyPayFunction } from "@/lib/database/function_mypay";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing user ID." },
        { status: 400 }
      );
    }
    
    const history = await getUserMyPayFunction(id);
    
    // Assuming getUserMyPayFunction returns an array
    if (!history) {
      console.warn("No transactions found for user ID:", id);
      return NextResponse.json(
        { message: "No transactions found." },
        { status: 200 } // Return 200 with empty array
      );
    }
    
    return NextResponse.json(history, { status: 200 });
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
