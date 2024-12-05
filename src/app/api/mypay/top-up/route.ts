// app/api/mypay/top-up/route.ts

import { NextResponse } from "next/server";
import { topUpMyPayFunction } from "@/lib/database/function_mypay";

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();

    // Validate input
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing userId." },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid or missing amount." },
        { status: 400 }
      );
    }

    // Call the Top Up function
    await topUpMyPayFunction(userId, amount);

    return NextResponse.json({ message: "Top Up successful." }, { status: 200 });
  } catch (error: any) {
    console.error('Top Up Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}