// app/api/mypay/withdrawal/route.ts

import { NextResponse } from "next/server";
import { WithdrawalMyPayFunction } from "@/lib/database/function_mypay";

export async function POST(request: Request) {
  try {
    const { userId, amount } = await request.json();

    // Validate input
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing userId." },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount." }, { status: 400 });
    }

    await WithdrawalMyPayFunction(userId, amount);

    return NextResponse.json({ message: "Withdrawal successful." }, { status: 200 });
  } catch (error: any) {
    console.error("Withdrawal Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
