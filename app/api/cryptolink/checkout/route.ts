// app/api/cryptolink/checkout/route.ts
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const plan = (searchParams.get("plan") || "").trim().toUpperCase();

  if (!plan || (plan !== "PRO" && plan !== "BUSINESS")) {
    return Response.json({ ok: false, error: "Unsupported plan" }, { status: 400 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const email = (body?.email || "").toString().trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return Response.json({ ok: false, error: "Missing/invalid email" }, { status: 400 });
  }

  const apiBase =
    process.env.CRYPTOLINK_API_BASE?.replace(/\/+$/, "") ||
    "https://cryptolink-production.up.railway.app";

  const upstreamUrl = `${apiBase}/v1/billing/checkout?plan=${encodeURIComponent(plan)}`;

  const upstream = await fetch(upstreamUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // opcional, ayuda a Stripe idempotency si lo usas del lado backend:
      "Idempotency-Key": `evilink_${crypto.randomUUID()}`,
    },
    body: JSON.stringify({ email }),
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
    },
  });
}
