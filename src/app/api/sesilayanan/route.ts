import { NextResponse } from "next/server";
import { showSesilayanan } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("ini body", body);
    const { subkategoriId } = body;

    console.log("ini id", subkategoriId);
    
    const subjasa = await showSesilayanan(subkategoriId);

    console.log("ini sesilayanan", subjasa);

    let hasil = NextResponse.json(subjasa);
    return hasil;
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}