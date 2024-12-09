// app/api/jobs/kerjakan_pesanan/route.ts

import { NextResponse } from "next/server";
import { KerjakanPesananFunction } from "@/lib/database/function_jobs";

export async function POST(req: Request) {
  try {
    // Parse the JSON body
    const { orderId, pekerjaId } = await req.json();

    // Validate input
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing orderId." },
        { status: 400 }
      );
    }

    // Validate input
    if (!pekerjaId || typeof pekerjaId !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing pekerjaId." },
        { status: 400 }
      );
    }

    // Optional: Validate UUID format using a regex or a library like 'validator' or 'uuid'
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      return NextResponse.json(
        { message: "Invalid UUID format for orderId." },
        { status: 400 }
      );
    }
    if (!uuidRegex.test(pekerjaId)) {
      return NextResponse.json(
        { message: "Invalid UUID format for pekerjaId." },
        { status: 400 }
      );
    }

    // Call the KerjakanPesanan function to process the order
    await KerjakanPesananFunction(orderId, pekerjaId);

    // Return a success response
    return NextResponse.json(
      { message: "Order processed successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Kerjakan Pesanan Error in route:', error);

    // Handle specific error messages if needed
    if (error.message.includes('does not exist')) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }

    if (error.message.includes('already been applied')) {
      return NextResponse.json(
        { message: error.message },
        { status: 200 } // You might choose a different status based on your preference
      );
    }

    // Default to internal server error
    return NextResponse.json(
      { message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
