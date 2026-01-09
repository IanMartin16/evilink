// app/api/docs/cryptolink/route.ts
import { NextResponse } from "next/server";
import { cryptolinkDocs } from "@/lib/cryptolink/docs";

export function GET() {
  return NextResponse.json(cryptolinkDocs, {
    headers: {
      "cache-control": "public, max-age=300",
    },
  });
}
