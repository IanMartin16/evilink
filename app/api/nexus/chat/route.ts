import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const sessionId = String(body?.sessionId ?? "web");
  const product = String(body?.product ?? "curpify");
  const message = String(body?.message ?? "");

  const BASE = process.env.NEXUS_API_BASE || process.env.NEXUS_API_URL;
  const SECRET = process.env.NEXUS_WEB_SECRET;

  if (!BASE) {
    return NextResponse.json({ ok: false, error: "Missing NEXUS_API_BASE" }, { status: 500 });
  }

  const base = BASE.startsWith("http") ? BASE : `https://${BASE}`;
  const url = `${base.replace(/\/$/, "")}/v1/mcp/chat`;

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(SECRET ? { "x-web-secret": SECRET } : {}),
    },
    body: JSON.stringify({ sessionId, product, message }),
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
