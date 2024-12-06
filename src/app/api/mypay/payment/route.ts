// app/api/mypay/payment/route.ts

import { NextResponse } from "next/server";
import { ServicePaymentMyPayFunction } from "@/lib/database/function_mypay";

export async function POST(request: Request) {
  try {
    const { userId, amount } = await request.json();

    if (!userId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    await ServicePaymentMyPayFunction(userId, amount);

    return NextResponse.json({ message: "Service Payment successful." }, { status: 200 });
  } catch (error: any) {
    console.error("Payment Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
