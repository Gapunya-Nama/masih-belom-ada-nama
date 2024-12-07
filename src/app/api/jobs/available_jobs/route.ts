// apps/jobs/api/available_jobs/route.ts

import { NextResponse } from "next/server";
import { getAvailableJobs } from "@/lib/database/function_jobs"; // Adjust the path as necessary

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pekerjaId = searchParams.get('pekerjaId');

    // Validate pekerjaId
    if (!pekerjaId) {
      return NextResponse.json(
        { message: "Missing 'pekerjaId' in query parameters." },
        { status: 400 }
      );
    }

    // Optional: Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pekerjaId)) {
      return NextResponse.json(
        { message: "Invalid 'pekerjaId' format." },
        { status: 400 }
      );
    }

    const orders = await getAvailableJobs(pekerjaId);

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("API Route Error - GET /api/jobs/available_jobs:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
