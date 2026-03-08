import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid or expired code" }, { status: 400 });
    }

    await user.save();

    return NextResponse.json({ success: true});
  } catch (err) {
    console.error("Verify code error:", err);
    return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 });
  }
}
