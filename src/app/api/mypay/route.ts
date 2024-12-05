import { NextResponse } from "next/server";
import { getUserMyPayFunction } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id } = body;
    
    const history = await getUserMyPayFunction(id);
    
    if (!history) {
        console.error("ini idnya: ",id)
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