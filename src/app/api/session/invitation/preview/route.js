import { errorResponse } from "../../_shared";
import { NextResponse } from "next/server";
import { apiJson } from "@/lib/api";

export async function POST(request) {
  try {
    const data = await apiJson("/api/auth/invitations/preview", { method: "POST", body: await request.json() });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorResponse(error);
  }
}
