import { NextResponse } from "next/server";
import { submitWorkerRegis } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { params } = body;
    
    const history = await submitWorkerRegis(params);
    
    if (!history) {
        console.error("ini idnya: ",params)
        return NextResponse.json(
        { message: "Empty:"},
        { status: 401 }
      );
    }
        
    let hasil = NextResponse.json(history);
    return hasil;
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}