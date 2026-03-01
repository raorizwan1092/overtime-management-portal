import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/utils/verifyToken";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const { newPassword } = await req.json();
        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(decoded.userId, {
            password: hashedPassword,
            mustChangePassword: false,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json(
            { success: false, error: "Failed to change password" },
            { status: 500 }
        );
    }
}
