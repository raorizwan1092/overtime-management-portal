import { USER_ROLES } from "@/constants/AppConstants";
import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";

export async function DELETE(req, { params }) {
    const decoded = verifyToken(req);

    if (!decoded) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    if (decoded.role !== USER_ROLES.HR) {
        return NextResponse.json(
            { success: false, error: "Only HR can delete users" },
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

        if (user.role === USER_ROLES.MANAGER) {
            const teamMembers = await User.countDocuments({
                managerId: user._id,
            });

            if (teamMembers > 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "Manager cannot be deleted because employees are assigned to them.",
                    },
                    { status: 400 }
                );
            }
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
