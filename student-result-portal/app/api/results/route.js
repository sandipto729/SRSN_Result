import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StudentAcademic from "@/model/student-academics";
import Alumni from "@/model/alumni";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/results - Get results for current user (student/alumni)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const academicYear = searchParams.get("academicYear");
    const classFilter = searchParams.get("class");
    const semester = searchParams.get("semester");
    const email = searchParams.get("email");

    // For admin: get all results with filters
    if (session.user.role === "admin") {
      // If email is provided, get all results for that specific student
      if (email) {
        const alumni = await Alumni.findOne({ email });
        if (!alumni) {
          return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const filter = { alumniId: alumni._id, isPublished: true };
        if (academicYear) filter.academicYear = academicYear;
        if (classFilter) filter.class = classFilter;
        if (semester) filter.semester = semester;

        const results = await StudentAcademic.find(filter)
          .sort({ academicYear: -1, semester: 1 })
          .lean();

        return NextResponse.json({ results });
      }

      // Otherwise, get all results with filters
      const filter = {};
      if (academicYear) filter.academicYear = academicYear;
      if (classFilter) filter.class = classFilter;
      if (semester) filter.semester = semester;
      filter.isPublished = true;

      const results = await StudentAcademic.find(filter)
        .populate("alumniId", "name email phone")
        .sort({ "alumniId.name": 1, academicYear: -1, semester: 1 })
        .lean();

      return NextResponse.json({ results });
    }

    // For students/alumni: get their own results
    if (session.user.role === "student") {
      const alumni = await Alumni.findOne({ email: session.user.email });
      if (!alumni) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }

      const filter = { alumniId: alumni._id, isPublished: true };
      if (academicYear) filter.academicYear = academicYear;
      if (classFilter) filter.class = classFilter;
      if (semester) filter.semester = semester;

      const results = await StudentAcademic.find(filter)
        .sort({ academicYear: -1, semester: 1 })
        .lean();

      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

