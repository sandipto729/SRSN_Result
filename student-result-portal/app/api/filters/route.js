import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StudentAcademic from "@/model/student-academics";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/filters - Get available filter options (academicYear, class, semester)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get distinct values for filters
    const academicYears = await StudentAcademic.distinct("academicYear", { isPublished: true });
    const classes = await StudentAcademic.distinct("class", { isPublished: true });
    const semesters = await StudentAcademic.distinct("semester", { isPublished: true });

    return NextResponse.json({
      academicYears: academicYears.sort().reverse(),
      classes: classes.sort(),
      semesters: semesters.sort()
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

