import connectDB from "@/lib/dbconnection";
import Rules from "@/models/Rules";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { USER_ROLES } from "@/constants/AppConstants";

export async function GET(req) {

    try {
        const decoded = verifyToken(req);
        // if (!decoded || decoded.role !== USER_ROLES.HR) {
        //     return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        // }
        await connectDB();

        let rule = await Rules.findOne();
        if (!rule) {
            rule = await Rules.create({
                maxHours: 8,
                rate8to10: 0,
                rate10to12: 0,
            });
        }

        return NextResponse.json({ success: true, rules: [rule] });
    } catch (err) {
        console.error("Error fetching rule:", err);
        return NextResponse.json({ success: false, error: "Failed to fetch rules" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const decoded = verifyToken(req);
        if (!decoded || decoded.role !== USER_ROLES.HR) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }
        await connectDB();

        const { maxHours, rate8to10, rate10to12 } = await req.json();

        if (!maxHours || isNaN(maxHours) || Number(maxHours) <= 0) {
            return NextResponse.json({ success: false, error: "Invalid maximum hours" }, { status: 400 });
        }
        if (!rate8to10 || isNaN(rate8to10) || Number(rate8to10) < 0) {
            return NextResponse.json({ success: false, error: "Invalid hourly rate 8-10" }, { status: 400 });
        }
        if (!rate10to12 || isNaN(rate10to12) || Number(rate10to12) < 0) {
            return NextResponse.json({ success: false, error: "Invalid hourly rate 10-12" }, { status: 400 });
        }

        const existingRule = await Rules.findOne({ maxHours: Number(maxHours) });
        if (existingRule) {
            return NextResponse.json({ success: false, error: "Rule for this maximum hours already exists" }, { status: 400 });
        }

        const newRule = await Rules.create({
            maxHours: Number(maxHours),
            rate8to10: Number(rate8to10),
            rate10to12: Number(rate10to12),
        });

        return NextResponse.json({ success: true, rule: newRule });
    } catch (error) {
        console.error("Error creating rule:", error);
        return NextResponse.json({ success: false, error: "Failed to create rule" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const decoded = verifyToken(req);
        if (!decoded || decoded.role !== USER_ROLES.HR) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }
        await connectDB();

        const { id, maxHours, rate8to10, rate10to12 } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: "Rule ID is required" }, { status: 400 });
        }
        if (maxHours !== undefined && (isNaN(maxHours) || Number(maxHours) <= 0)) {
            return NextResponse.json({ success: false, error: "Invalid maximum hours" }, { status: 400 });
        }
        if (rate8to10 !== undefined && (isNaN(rate8to10) || Number(rate8to10) < 0)) {
            return NextResponse.json({ success: false, error: "Invalid hourly rate 8-10" }, { status: 400 });
        }
        if (rate10to12 !== undefined && (isNaN(rate10to12) || Number(rate10to12) < 0)) {
            return NextResponse.json({ success: false, error: "Invalid hourly rate 10-12" }, { status: 400 });
        }

        const rule = await Rules.findById(id);
        if (!rule) {
            return NextResponse.json({ success: false, error: "Rule not found" }, { status: 404 });
        }

        if (maxHours !== undefined) rule.maxHours = Number(maxHours);
        if (rate8to10 !== undefined) rule.rate8to10 = Number(rate8to10);
        if (rate10to12 !== undefined) rule.rate10to12 = Number(rate10to12);

        await rule.save();

        return NextResponse.json({ success: true, rule });
    } catch (error) {
        console.error("Error updating rule:", error);
        return NextResponse.json({ success: false, error: "Failed to update rule" }, { status: 500 });
    }
}