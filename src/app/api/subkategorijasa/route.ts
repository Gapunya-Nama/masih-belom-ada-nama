import { NextResponse } from "next/server";
import { getSubKategoriJasa } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama } = body;
    
    const subjasa = await getSubKategoriJasa(nama);

    
    
    if (!subjasa) {
      console.error("No subcategory found for:", nama);
        return NextResponse.json(
        { message: "Empty:"},
        { status: 503 }
      );
    }

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