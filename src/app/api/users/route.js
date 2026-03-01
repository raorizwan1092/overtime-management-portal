import { USER_ROLES } from "@/constants/AppConstants";
import connectDB from "@/lib/dbconnection";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";
import { welcomeEmailTemplate } from "@/lib/emails/WelcomeEmail";
import { verifyToken } from "@/utils/verifyToken";
const LIMIT = process.env.PAGE_LIMIT || 10;

export async function GET(req) {
  const decoded = verifyToken(req);
  if (!decoded || decoded.role !== USER_ROLES.HR) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || LIMIT;
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;
    const baseQuery = {
      createdBy: decoded.id, // ✅ filter by HR
    };

    const query = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        limit,
      },
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const decoded = verifyToken(req);
  if (!decoded || decoded.role !== USER_ROLES.HR) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    const { name, email, phone, role, hourlyRate } = await req.json();

    if (!Object.values(USER_ROLES).includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    if (!hourlyRate || isNaN(hourlyRate) || Number(hourlyRate) <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid hourly rate" },
        { status: 400 }
      );
    }

    // Check individually
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      return NextResponse.json(
        { success: false, error: "User with this phone number already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      role,
      hourlyRate: Number(hourlyRate),
      password: hashedPassword,
      createdBy: decoded.userId,
    });
    

    try {
      await sendEmail({
        to: newUser.email,
        subject: "Welcome to Our App!",
        html: welcomeEmailTemplate({
          name: newUser.name,
          email: newUser.email,
          password: generatedPassword,
          mustChangePassword: true,
        }),
      });
    } catch (err) {
      console.error("Error sending welcome email:", err);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        hourlyRate: newUser.hourlyRate,
      },
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}

