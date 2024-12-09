/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { authenticateUserFunction, getAllVoucher, getAllPromo, buyVoucher } from "@/lib/database/function_diskon";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { message: "Missing 'action' parameter. Expected one of: 'authenticateUser', 'getAllVoucher', 'getAllPromo', 'buyVoucher'." },
        { status: 400 }
      );
    }

    let result: any = null;

    switch (action) {
      case "authenticateUser":
        // Pastikan parameter 'phone' dan 'password' ada di dalam body request
        if (!body.phone || !body.password) {
          return NextResponse.json(
            { message: "Missing parameters. 'phone' and 'password' are required for authenticateUser." },
            { status: 400 }
          );
        }

        result = await authenticateUserFunction({ phone: body.phone, password: body.password });
        
        if (!result) {
          return NextResponse.json(
            { message: "Authentication failed. User not found or invalid credentials." },
            { status: 401 }
          );
        }
        
        return NextResponse.json(result);

      case "getAllVoucher":
        result = await getAllVoucher();
        if (!result || result.length === 0) {
          return NextResponse.json(
            { message: "No vouchers found." },
            { status: 404 }
          );
        }
        return NextResponse.json(result);

      case "getAllPromo":
        result = await getAllPromo();
        if (!result || result.length === 0) {
          return NextResponse.json(
            { message: "No promos found." },
            { status: 404 }
          );
        }
        return NextResponse.json(result);

      case "buyVoucher":
        // Pastikan parameter 'userId', 'voucherId', dan 'metodeId' ada di dalam body request
        if (!body.userId || !body.voucherId || !body.metodeId) {
          return NextResponse.json(
            { message: "Missing parameters. 'userId', 'voucherId', and 'metodeId' are required for buyVoucher." },
            { status: 400 }
          );
        }

        await buyVoucher(body.userId, body.voucherId, body.metodeId);
        return NextResponse.json({ message: "Voucher successfully purchased." });

      default:
        return NextResponse.json(
          { message: "Invalid 'action' parameter. Expected one of: 'authenticateUser', 'getAllVoucher', 'getAllPromo', 'buyVoucher'." },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
