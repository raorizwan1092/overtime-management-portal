import { USER_ROLES } from "@/constants/AppConstants";
import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";

export async function PATCH(req, { params }) {
    const decoded = verifyToken(req);

    if (!decoded) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    if (decoded.role !== USER_ROLES.HR) {
        return NextResponse.json(
            { success: false, error: "Only HR can unassign employees" },
            { status: 403 }
        );
    }

    try {
        await connectDB();

        const { id } = await params;

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        if (user.role !== USER_ROLES.EMPLOYEE) {
            return NextResponse.json(
                { success: false, error: "Only employees can be unassigned" },
                { status: 400 }
            );
        }

        await User.findByIdAndUpdate(id, {
            $unset: { managerId: "" },
        });

        return NextResponse.json({
            success: true,
            message: "Employee unassigned from manager successfully",
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, error: "Failed to unassign employee" },
            { status: 500 }
        );
    }
}
