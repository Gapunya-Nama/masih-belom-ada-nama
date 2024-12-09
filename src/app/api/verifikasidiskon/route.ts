import { NextResponse } from "next/server";
import { IsDiskonValid } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("ini body " + body);
    const { kode } = body;

    console.log("ini kode", kode);
    
    const status = await IsDiskonValid(kode);

    console.log("ini status", status);

    let hasil = NextResponse.json(status);
    return hasil;
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}