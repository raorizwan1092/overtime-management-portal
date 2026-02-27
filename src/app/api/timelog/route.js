import { verifyToken } from "@/utils/verifyToken";

export async function POST(req) {
    const decoded = verifyToken(req);
  
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
  
    try {
      await connectDB();
  
      const { date, hours, note } = await req.json();
  
      if (!date || !hours || hours <= 0) {
        return NextResponse.json(
          { success: false, error: "Invalid data" },
          { status: 400 }
        );
      }
  
      const existingEntry = await TimeLog.findOne({
        user: decoded.id,
        date: new Date(date),
      });
  
      if (existingEntry) {
        return NextResponse.json(
          { success: false, error: "Time already added for this date" },
          { status: 400 }
        );
      }
  
      const newEntry = await TimeLog.create({
        user: decoded.userId,
        date,
        hours,
        note,
      });
  
      return NextResponse.json({
        success: true,
        entry: newEntry,
      });
  
    } catch (error) {
      console.error("Error adding time:", error);
      return NextResponse.json(
        { success: false, error: "Failed to add time" },
        { status: 500 }
      );
    }
  }
  