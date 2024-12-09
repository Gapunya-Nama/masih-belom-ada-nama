import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { showPemesananJasa, addPemesananJasa } from "@/lib/database/function_pemesananjasa";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Ini body co", body);
    if(body.command === 'show'){
      const { userId } = body;
      const pesanan = await showPemesananJasa(userId);

      console.log("ini pesanan", pesanan);
      return NextResponse.json(pesanan);
    }
    else if(body.command === 'add'){
      console.log("masuk");
      const { tglPemesanan } = body;
      const { tglPekerjaan } = body;
      const { waktuPekerjaan } = body;
      const { totalBiaya } = body;
      const { idPelanggan } = body;
      const { idPekerja } = body;
      const { idKategoriJasa } = body;
      const { sesi } = body;
      let { idDiskon } = body;
      if (!idDiskon) {
        idDiskon = '0';
      }
      const { idMetodeBayar } = body;
      const idtransaksi = uuidv4();

      const pemesananjasa = await addPemesananJasa(tglPemesanan, tglPekerjaan, waktuPekerjaan, totalBiaya, idPelanggan, idPekerja, idKategoriJasa, sesi, idtransaksi, idMetodeBayar, idDiskon);

      return NextResponse.json(pemesananjasa);
    }
    else{
      return NextResponse.json("Command not found", { status: 401 });
    }
  } catch (error: any) {
    console.error('MyPay Error in route:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
