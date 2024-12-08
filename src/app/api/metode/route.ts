import { NextResponse } from "next/server";
import { getMetodeBayar } from "@/lib/database/function";

export async function POST(req: Request) {
  try {    
    const MetodeBayar = await getMetodeBayar();

    
    if (!MetodeBayar) {
        return NextResponse.json(
        { message: "Empty:"},
        { status: 401 }
      );
    }
        
    let hasil = NextResponse.json(MetodeBayar);
    return hasil;
  } catch (error: any) {
    console.error('Homepage Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}