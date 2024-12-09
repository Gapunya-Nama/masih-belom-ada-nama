import { NextResponse } from "next/server";
import { addWorkerToCategory, showPekerja } from "@/lib/database/function";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Ini body co", body);
    if(body.command === 'show') {
      const { id } = body;

      console.log("ini nama", id);
      
      const pekerja = await showPekerja(id);

      console.log("ini pekerja", pekerja);

      return NextResponse.json(pekerja);
    }
    else if(body.command === 'add') {
      console.log("masuk pak eko");
      const { id } = body;
      const { kategoriJasaId } = body;

      console.log("ini nama add ", id);
      console.log("ini kategoriJasaId add ", kategoriJasaId);
      const pekerja = await addWorkerToCategory(id, kategoriJasaId);

      return NextResponse.json(pekerja);
    }
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
