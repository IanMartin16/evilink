import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const NEXUS_API_URL = process.env.NEXUS_API_URL;
  const NEXUS_WEB_SECRET = process.env.NEXUS_WEB_SECRET;

  if (!NEXUS_API_URL) {
    return NextResponse.json({ ok: false, error: "Missing NEXUS_API_URL" }, { status: 500 });
  }

  const resp = await fetch(`${NEXUS_API_URL}/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(NEXUS_WEB_SECRET ? { "x-web-secret": NEXUS_WEB_SECRET } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await resp.text(); // 👈 lee crudo

  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: resp.status });
  } catch {
    // 👇 Si no es JSON, te lo muestro para saber qué regresó Spring
    return NextResponse.json(
      {
        ok: false,
        status: resp.status,
        contentType: resp.headers.get("content-type"),
        raw: text.slice(0, 2000),
      },
      { status: 200 }
    );
  }
}

