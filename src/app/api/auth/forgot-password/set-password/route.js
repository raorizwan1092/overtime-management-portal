import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        const { email, newPassword, token } = await req.json();

        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "Invalid token or expired" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.mustChangePassword = false;
        user.resetPasswordCode = undefined;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Set new password error:", err);
        return NextResponse.json({ success: false, error: "Failed to change password" }, { status: 500 });
    }
}
