import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const NEXUS_API_URL = process.env.NEXUS_API_URL;
  if (!NEXUS_API_URL) {
    return NextResponse.json({ ok: false, error: "Missing NEXUS_API_URL" }, { status: 500 });
  }

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") || "";
  const product = url.searchParams.get("product") || "";
  const limit = url.searchParams.get("limit") || "30";

  const upstream = `${NEXUS_API_URL}/v1/history?sessionId=${encodeURIComponent(sessionId)}&product=${encodeURIComponent(product)}&limit=${encodeURIComponent(limit)}`;

  const resp = await fetch(upstream, {
    method: "GET",
    headers: {
      ...(process.env.NEXUS_WEB_SECRET ? { "x-web-secret": process.env.NEXUS_WEB_SECRET } : {}),
    },
    cache: "no-store",
  });

  const data = await resp.json().catch(() => ({}));
  return NextResponse.json(data, { status: resp.status });
}
