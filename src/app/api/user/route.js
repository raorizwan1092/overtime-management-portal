import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { USER_ROLES } from "@/constants/AppConstants";

export async function GET(req) {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ user: null }, { status: 404 });
        }
        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                hourlyRate: user.hourlyRate,
            },
        });
    } catch (err) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}

export async function PUT(req) {
    const decoded = verifyToken(req);
    if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { name, phone, email, hourlyRate, role } = await req.json();

    if (name !== undefined && name.trim() === "") {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (email !== undefined && email.trim() === "") {
        return NextResponse.json({ error: "Email cannot be empty" }, { status: 400 });
    }

    if (hourlyRate !== undefined && (isNaN(hourlyRate) || hourlyRate < 0)) {
        return NextResponse.json({ error: "Hourly rate must be a positive number" }, { status: 400 });
    }

    if (role !== undefined && !Object.values(USER_ROLES).includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    try {
        if (email) {
            const existingEmailUser = await User.findOne({ email, _id: { $ne: decoded.userId } });
            if (existingEmailUser) {
                return NextResponse.json({ error: "Email already in use" }, { status: 400 });
            }
        }

        if (phone) {
            const existingPhoneUser = await User.findOne({ phone, _id: { $ne: decoded.userId } });
            if (existingPhoneUser) {
                return NextResponse.json({ error: "Phone number already in use" }, { status: 400 });
            }
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email.trim().toLowerCase();
        if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
        if (role !== undefined) updateData.role = role;

        const updatedUser = await User.findByIdAndUpdate(decoded.userId, updateData, { new: true }).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error("Error updating user:", err);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
