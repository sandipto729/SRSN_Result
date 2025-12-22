import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Alumni from "@/model/alumni";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/alumni - Get alumni data by email
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Only allow users to get their own data, or admin to get any data
    if (session.user.role === "admin" || session.user.email === email) {
      const alumni = await Alumni.findOne({ email }).lean();
      if (!alumni) {
        return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
      }
      return NextResponse.json(alumni);
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Error fetching alumni:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

