/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getTestimoni } from "@/lib/database/function_testimonial";

export async function POST(req: Request) {
  try {
    const { idkategori } = await req.json();  // Mengambil 'idkategori' dari body request

    if (!idkategori) {
      return NextResponse.json(
        { message: "Missing 'idkategori' parameter." },
        { status: 400 }
      );
    }

    // Mengambil data testimoni berdasarkan idkategori
    const testimoniData = await getTestimoni(idkategori);

    if (!testimoniData) {
      return NextResponse.json(
        { message: `No testimonials found for category ${idkategori}.` },
        { status: 200 }
      );
    }

    return NextResponse.json(testimoniData);  // Mengembalikan data testimoni dalam format JSON

  } catch (error: any) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
