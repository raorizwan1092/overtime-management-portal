import { USER_ROLES } from "@/constants/AppConstants";
import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";

export async function PATCH(req, { params }) {
    const decoded = verifyToken(req);

    if (!decoded || decoded.role !== USER_ROLES.HR) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { id } = await params;
        const { managerId } = await req.json();

        const employee = await User.findById(id);
        if (!employee || employee.role !== USER_ROLES.EMPLOYEE) {
            return NextResponse.json({ success: false, error: "Invalid employee" }, { status: 400 });
        }

        const manager = await User.findById(managerId);
        if (!manager || manager.role !== USER_ROLES.MANAGER) {
            return NextResponse.json({ success: false, error: "Invalid manager" }, { status: 400 });
        }

        employee.managerId = managerId;
        await employee.save();

        return NextResponse.json({ success: true, message: "Manager assigned successfully" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: "Failed to assign manager" }, { status: 500 });
    }
}

