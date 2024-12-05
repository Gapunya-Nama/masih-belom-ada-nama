// app/api/mypay/transfer/route.ts

import { NextResponse } from "next/server";
import { TransferMyPayFunction } from "@/lib/database/function_mypay";

export async function POST(request: Request) {
  try {
    const { userId, targetUserPhoneNum, amount } = await request.json();

    // Validate input
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing userId." },
        { status: 400 }
      );
    }

    if (!targetUserPhoneNum || typeof targetUserPhoneNum !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing targetUserPhoneNum." },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount." }, { status: 400 });
    }

    await TransferMyPayFunction(userId, targetUserPhoneNum.trim(), amount);

    return NextResponse.json({ message: "Transfer successful." }, { status: 200 });
  } catch (error: any) {
    console.error("Transfer Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
