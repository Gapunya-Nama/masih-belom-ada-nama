import { NextResponse } from "next/server";
import { showMetodeBayar } from "@/lib/database/function_metodepembayaran";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Ini body co", body);
    
    const metode = await showMetodeBayar();

    console.log("ini pekerja", metode);

    return NextResponse.json(metode);
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
