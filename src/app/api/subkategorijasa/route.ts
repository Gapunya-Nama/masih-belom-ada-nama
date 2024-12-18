import { NextResponse } from "next/server";
import { getSubKategoriJasa } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama } = body;

    console.log("ini nama", nama);
    
    const subjasa = await getSubKategoriJasa(nama);

    console.log("ini subjasa", subjasa);

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