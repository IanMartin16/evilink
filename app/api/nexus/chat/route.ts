import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Route /api/nexus/chat — UNIFICADO con switch de backend.
 *
 * Sirve a los DOS Nexus según la env NEXUS_BACKEND:
 *   - "core" (DEFAULT) -> Nexus core, exactamente como hoy en prod.
 *   - "slim"           -> nexus-slim (SSE + traducción de sections).
 *
 * SEGURIDAD: el default es "core". Si la env no está, está vacía, o es cualquier
 * valor que no sea exactamente "slim", el route usa Nexus core. Por eso hacer
 * push a prod SIN tocar la env deja todo idéntico a hoy — cero riesgo. El sistema
 * falla hacia lo seguro (Nexus core, que es lo que hoy funciona).
 *
 * CANARY: para probar nexus-slim en prod, se pone NEXUS_BACKEND=slim en Railway
 * (sin redeploy). Si algo falla, se vuelve a "core" en segundos. Nexus core sigue
 * VIVO durante todo esto — este switch NO lo elimina. Eliminar Nexus core (y su
 * BD) es un paso separado, posterior y manual en Railway, que solo se hace cuando
 * slim ya demostró y el history ya fue migrado/decidido.
 *
 * HISTORY: no se toca aquí. /api/nexus/history sigue apuntando a Nexus core
 * durante toda la convivencia (conserva el historial). Su hogar definitivo se
 * decide después (SSC, Nexus-memoria, etc.).
 */

const BACKEND = (process.env.NEXUS_BACKEND || "core").toLowerCase();

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const sessionId = String(body?.sessionId ?? "web");
  const product = String(body?.product ?? "curpify");
  const message = String(body?.message ?? "");

  // Selector: solo "slim" activa nexus-slim; cualquier otra cosa -> core.
  if (BACKEND === "slim") {
    return handleSlim({ sessionId, product, message });
  }
  return handleCore({ sessionId, product, message });
}

/* ─────────────────────────────────────────────────────────────────────────
   RAMA CORE — idéntica al route de producción actual.
   Llama a Nexus core /v1/mcp/chat con x-web-secret y devuelve tal cual.
   ───────────────────────────────────────────────────────────────────────── */
async function handleCore(args: { sessionId: string; product: string; message: string }) {
  const { sessionId, product, message } = args;

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

/* ─────────────────────────────────────────────────────────────────────────
   RAMA SLIM — nexus-slim (SSE) + traducción de sections al shape del widget.
   Transparente en fallos: si slim falla, se ve el error (NO cae a core), para
   que el canary muestre los problemas de slim en vez de enmascararlos.
   ───────────────────────────────────────────────────────────────────────── */
async function handleSlim(args: { sessionId: string; product: string; message: string }) {
  const { sessionId, message } = args;

  const SLIM = process.env.NEXUS_SLIM_URL || "http://localhost:8100";
  const url = `${SLIM.replace(/\/$/, "")}/chat`;

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId }),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: `nexus-slim unreachable: ${e?.message ?? "unknown"}` },
      { status: 502 }
    );
  }

  if (!resp.ok || !resp.body) {
    return NextResponse.json(
      { ok: false, error: `nexus-slim HTTP ${resp.status}` },
      { status: resp.status || 502 }
    );
  }

  const sections: any[] = [];
  let tokenText = "";
  let doneOk = true;
  let summary: string | null = null;

  try {
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        const evMatch = block.match(/^event:\s*(.+)$/m);
        const dataMatch = block.match(/^data:\s*(.+)$/m);
        if (!dataMatch) continue;

        const event = evMatch?.[1]?.trim();
        let payload: any;
        try {
          payload = JSON.parse(dataMatch[1]);
        } catch {
          continue;
        }

        if (event === "data" && Array.isArray(payload.sections)) {
          for (const s of payload.sections) sections.push(translateSection(s));
        } else if (event === "token" && typeof payload.delta === "string") {
          tokenText += payload.delta;
        } else if (event === "done") {
          doneOk = payload.ok !== false;
          summary = payload.summary ?? null;
        } else if (event === "error") {
          doneOk = false;
        }
      }
    }
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: `stream read failed: ${e?.message ?? "unknown"}` },
      { status: 502 }
    );
  }

  const bubbleText = tokenText.trim() || summary || "";
  const hasSomethingToShow = sections.length > 0 || bubbleText !== "";

  return NextResponse.json({
    ok: hasSomethingToShow ? true : doneOk,
    answer: {
      summary: bubbleText || (sections.length ? "" : "(sin respuesta)"),
      sections,
    },
    traceId: sessionId,
  });
}

/* Traduce una section de nexus-slim al shape que el widget espera. */
function translateSection(s: any): any {
  if (!s || typeof s !== "object") return s;

  if (s.type === "notice") {
    return {
      id: s.id,
      type: "notice",
      title: s.title ?? null,
      kind: s.level ?? "info",
      message: s.text ?? "",
      details: s.meta ?? null,
    };
  }

  if (s.type === "chart") {
    const items = (s.series ?? []).map((serie: any) => ({
      label: serie.symbol ?? serie.label ?? "",
      points: (serie.points ?? []).map((v: number) => ({ v })),
    }));
    return { id: s.id, type: "sparkline", title: s.title ?? null, items };
  }

  return s; // kpi_grid, text: ya coinciden
}
