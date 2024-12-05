import { NextResponse } from "next/server";
import { getAllVoucher, getAllPromo } from "@/lib/database/function_diskon";

export async function POST(req: Request) {
  try {
    const { type } = await req.json();  // Mengambil 'type' dari body request (voucher atau promo)

    if (!type) {
      return NextResponse.json(
        { message: "Missing 'type' parameter. Expected 'voucher' or 'promo'." },
        { status: 400 }
      );
    }

    let diskonData = null;

    if (type === "voucher") {
      diskonData = await getAllVoucher();  // Memanggil fungsi untuk mengambil data voucher
    } else if (type === "promo") {
      diskonData = await getAllPromo();  // Memanggil fungsi untuk mengambil data promo
    } else {
      return NextResponse.json(
        { message: "Invalid 'type' parameter. Expected 'voucher' or 'promo'." },
        { status: 400 }
      );
    }

    if (!diskonData) {
      return NextResponse.json(
        { message: `No ${type} found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(diskonData);  // Mengembalikan data dalam format JSON

  } catch (error: any) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
