import connectDB from "@/lib/dbconnection";
import TimeLog from "@/models/TimeLog";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { userId } = await params;

        const logs = await TimeLog.find({ user: userId })
            .sort({ date: -1 });

        return NextResponse.json({ success: true, data: logs });

    } catch (error) {
        console.error("Error fetching time logs:", error);

        return NextResponse.json(
            { success: false, message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}