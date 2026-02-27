import connectDB from "@/lib/dbconnection";
import TimeLog from "@/models/TimeLog";
import { verifyToken } from "@/utils/verifyToken";
import { NextResponse } from "next/server";


export async function GET(req) {
  const decoded = verifyToken(req);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month"));
  const year = parseInt(searchParams.get("year"));

  if (!month || !year) {
    return NextResponse.json(
      { error: "Month and year are required" },
      { status: 400 }
    );
  }

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));

  const logs = await TimeLog.find({
    user: decoded.userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  return NextResponse.json(logs);
}


export async function POST(req) {
  const decoded = verifyToken(req);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { date, hours, description } = await req.json();

  if (!date) {
    return NextResponse.json(
      { error: "Date is required" },
      { status: 400 }
    );
  }

  if (hours < 0 || hours > 24) {
    return NextResponse.json(
      { error: "Invalid hours" },
      { status: 400 }
    );
  }

  const dateOnly = new Date(date);
  dateOnly.setUTCHours(0, 0, 0, 0);

  const existingLog = await TimeLog.findOne({
    user: decoded.userId,
    date: dateOnly,
  });

  if (existingLog && existingLog.status === "APPROVED") {
    return NextResponse.json(
      { error: "Cannot edit approved log" },
      { status: 400 }
    );
  }

  const log = await TimeLog.findOneAndUpdate(
    { user: decoded.userId, date: dateOnly },
    {
      hours,
      description,
      status: "PENDING",
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, log });
}
