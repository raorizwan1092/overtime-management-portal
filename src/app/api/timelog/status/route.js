import connectDB from "@/lib/dbconnection";
import TimeLog from "@/models/TimeLog";
import { verifyToken } from "@/utils/verifyToken";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const decoded = verifyToken(req);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id, status, description } = await req.json();

    const updated = await TimeLog.findByIdAndUpdate(
      id,
      {
        status,
        description
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updated
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
