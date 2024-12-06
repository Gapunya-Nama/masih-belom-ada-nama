import { NextResponse } from "next/server";
import { showPekerja } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    console.log("ini nama", id);
    
    const pekerja = await showPekerja(id);

    console.log("ini pekerja", pekerja);

    return NextResponse.json(pekerja);
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}