import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        await connectDB();
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ user: null }, { status: 404 });
        }
        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
