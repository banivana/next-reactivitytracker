import { NextRequest, NextResponse } from "next/server";
import { getClientData } from "@/app/hooks/getClientData";
import { getUser } from "@/utils/server/getUser";
import { checkTrainerClientAccess } from "@/app/hooks/useTrainerClientAccess";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "0", 10);

    // Check user authentication and access
    const { user } = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hasAccess } = await checkTrainerClientAccess(user.id, userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Fetch paginated client data
    const clientData = await getClientData(userId, page);

    if (clientData.error) {
      return NextResponse.json(
        { error: "Failed to fetch client data" },
        { status: 500 },
      );
    }

    return NextResponse.json(clientData);
  } catch (error) {
    console.error("Error in client journal API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
