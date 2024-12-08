import { NextResponse } from "next/server";
import { showPemesananJasa } from "@/lib/database/function_pemesananjasa";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Ini body co", body);
    const { userId } = body;
    const pesanan = await showPemesananJasa(userId);

    console.log("ini pesanan", pesanan);

    return NextResponse.json(pesanan);
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
