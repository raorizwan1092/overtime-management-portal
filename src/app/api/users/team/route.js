import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId");

    if (!managerId) return NextResponse.json({ success: false, data: [], error: "Manager ID required" }, { status: 400 });

    await connectDB();
    const team = await User.find({ managerId }).select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: team });
}