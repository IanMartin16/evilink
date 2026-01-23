import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const NEXUS_API_URL = process.env.NEXUS_API_URL; // ej: http://localhost:8080 o https://xxx.up.railway.app
    const NEXUS_WEB_SECRET = process.env.NEXUS_WEB_SECRET;

    if (!NEXUS_API_URL) {
      return NextResponse.json(
        { ok: false, error: "Missing NEXUS_API_URL" },
        { status: 500 }
      );
    }

    const resp = await fetch(`${NEXUS_API_URL}/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(NEXUS_WEB_SECRET ? { "x-web-secret": NEXUS_WEB_SECRET } : {}),
      },
      body: JSON.stringify(body ?? {}),
      cache: "no-store",
    });

    const text = await resp.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { ok: false, error: "Non-JSON response from Nexus API", raw: text?.slice(0, 500) };
    }

    return NextResponse.json(data, { status: resp.status });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: `Proxy error: ${e?.message ?? "unknown"}` },
      { status: 500 }
    );
  }
}

