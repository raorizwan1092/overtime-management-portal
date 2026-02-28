import connectDB from "@/lib/dbconnection";
import TimeLog from "@/models/TimeLog";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectDB();

    const { id, status } = await req.json();

    const updated = await TimeLog.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
