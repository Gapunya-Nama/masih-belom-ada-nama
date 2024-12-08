// app/api/jobs/taken_jobs_update/route.ts

import { NextResponse } from "next/server";
import { updateStatusPesananFunction, UpdatedJob } from "@/lib/database/function_jobs"; // Ensure UpdatedJob is exported

export async function POST(req: Request) {
  try {
    // Parse the JSON body
    const { orderId, nextStatusId } = await req.json();

    // Validate input
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing orderId." },
        { status: 400 }
      );
    }

    if (!nextStatusId || typeof nextStatusId !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing nextStatusId." },
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

    if (!uuidRegex.test(nextStatusId)) {
      return NextResponse.json(
        { message: "Invalid UUID format for nextStatusId." },
        { status: 400 }
      );
    }

    // Call the updateStatusPesananFunction to process the order and get updated data
    const updatedJob: UpdatedJob | null = await updateStatusPesananFunction(orderId, nextStatusId);

    if (updatedJob) {
      // Status was successfully updated
      return NextResponse.json(
        { message: "Order status processed successfully.", data: updatedJob },
        { status: 200 }
      );
    } else {
      // Status was already applied
      return NextResponse.json(
        { message: "Status has already been applied to this order." },
        { status: 200 } // You might choose a different status code if desired
      );
    }
  } catch (error: any) {
    console.error('Update status pesanan Error in route:', error);

    // Handle specific error messages if needed
    if (error.message.includes('does not exist')) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }

    // Default to internal server error
    return NextResponse.json(
      { message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
