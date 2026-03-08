import connectDB from "@/lib/dbconnection";
import { sendEmail } from "@/lib/mailer";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { forgotPasswordTemplate } from "@/lib/emails/forgotPasswordTemplate"
export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordCode = code;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Code",
                html: forgotPasswordTemplate({
                    name: user.name,
                    code,
                    expiresIn: "10 minutes",
                }),
            });
        } catch (err) {
            console.error("Error sending email:", err);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Send forgot password code error:", error);
        return NextResponse.json({ success: false, error: "Failed to send code" }, { status: 500 });
    }
}
