import { NextRequest, NextResponse } from "next/server";
import { getFrames } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const category = searchParams.get("category") || undefined;
  const tag = searchParams.get("tag") || undefined;
  const search = searchParams.get("q") || undefined;

  const result = await getFrames(page, { category, tag, search });
  return NextResponse.json(result);
}
