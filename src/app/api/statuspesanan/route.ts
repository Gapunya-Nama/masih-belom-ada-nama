import { NextResponse } from "next/server";
import { updateStatus } from "@/lib/database/function_statuspesanan";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Ini body co", body);
    const { idtr } = body;
    const { idstatus } = body;
    const { tglwaktu } = body;

    const statuspesanan = await updateStatus(idtr, idstatus, tglwaktu);

    console.log("ini status", statuspesanan);

    return NextResponse.json(statuspesanan);
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
