import { NextResponse } from "next/server";
import { getDiskon } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("ini body " + body);
    const { kode } = body;

    console.log("ini kode", kode);
    
    const diskon = await getDiskon(kode);

    console.log("ini diskon", diskon);

    let hasil = NextResponse.json(diskon);
    return hasil;
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}