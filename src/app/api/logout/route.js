import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully",
        });

        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 0,
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Logout failed" },
            { status: 500 }
        );
    }
}
