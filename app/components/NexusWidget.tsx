"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Geist, Sora } from "next/font/google";

const EVILINK = {
  accent: "#2BFF88",        // verde neón
  accent2: "#00E5FF",       // cian para detalle
  bg: "#0B0F14",            // fondo oscuro
  panel: "#0F1620",         // panel
  border: "rgba(255,255,255,0.10)",
  text: "rgba(255,255,255,0.92)",
  muted: "rgba(255,255,255,0.65)",
  bubbleUser: "rgba(43,255,136,0.14)",
  bubbleBot: "rgba(255,255,255,0.08)",
};

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

type Product = "curpify" | "cryptolink" | "evilink" | "data_link" | "vsecrets" | "status_hub" | "mcpone" | "nexus";
type McpSection = {
  id: string;
  type: string;
  title: string | null;
  text?: string | null;
  kind?: string | null;
  message?: string | null;
  details?: string | null;
  items?: Array<{ label?: string; value?: any; unit?: string; points?: Array<{t?: string; v?: number }> }> | null;
}
type Msg = {
  id: string; 
  role: "user" | "assistant" | "system"; 
  text: string; 
  ts: number, 
  product: string;
  sections?: McpSection[];

  traceId?: string;
  toolCalls?: any[];
  toolResults?: any[];
};

const LS_KEY = "nexus_widget_state_v1";
const LS_PRODUCT_KEY = "nexus.product";
const LS_SESSION_KEY = "nexus.sessionId";
const LS_MSGS = (p: string) => `nexus_msgs_${p}`;
const LS_LAST_PRODUCT = "nexus.product";


function safeParse<T>(s: string | null): T | null {
  if (!s) return null;
  try { return JSON.parse(s) as T; } catch { return null; }
}

/** Markdown ultra-ligero: negritas + inline code + code blocks */
function renderLiteMarkdown(text: string) {
  // Split por code blocks ```
  const parts = text.split(/```/g);
  return parts.map((chunk, idx) => {
    const isCodeBlock = idx % 2 === 1;
    if (isCodeBlock) {
      return (
        <pre key={idx} style={{
          margin: "10px 0",
          padding: 12,
          borderRadius: 12,
          background: "rgba(0,0,0,0.06)",
          overflowX: "auto",
          fontSize: 12,
          lineHeight: 1.4
        }}>
          <code>{chunk.replace(/^\w+\n/, "")}</code>
        </pre>
      );
    }

    // Inline formatting: **bold** and `code`
    const inline = chunk
      .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
      .filter(Boolean)
      .map((t, j) => {
        if (t.startsWith("**") && t.endsWith("**")) {
          return <strong key={j}>{t.slice(2, -2)}</strong>;
        }
        if (t.startsWith("`") && t.endsWith("`")) {
          return (
            <code key={j} style={{
              padding: "2px 6px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.06)",
              fontSize: 12
            }}>
              {t.slice(1, -1)}
            </code>
          );
        }
        return <span key={j}>{t}</span>;
      });

    return <span key={idx}>{inline}</span>;
  });
}

export default function NexusWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const canSend = input.trim().length > 0 && !loading;
  const [isDesktop, setIsDesktop] = useState(false);
  const [devMode, setDevMode] = useState(true);

  const [msgs, setMsgs] = useState<Msg[]>([]);

  const [product, setProduct] = useState<string>(() => {
    if (typeof window === "undefined") return "evi_link";
    return localStorage.getItem(LS_PRODUCT_KEY) || "evi_link";
  });

const PRODUCT_LABEL: Record<string, string> = {
  curpify: "Curpify",
  cryptolink: "CryptoLink",
  data_link: "Data_Link",
  vsecrets: "V-Secrets",
  status_hub: "Status-hub",
  mcpone: "MCPOne",
  nexus: "Nexus",
  evilink: "evi_link",
};

const SOFT_LAUNCH_PRODUCTS = [
  {
    id: "curpify",
    name: "Curpify",
    tag: "Identity API",
    status: "Soft launch ready",
    summary: "Validación CURP/RFC e identidad estructurada.",
    pills: ["CURP", "RFC", "HR", "API"],
  },
  {
    id: "data_link",
    name: "Data_Link",
    tag: "Data Processing",
    status: "Soft launch ready",
    summary: "Limpieza, deduplicación y transformación de CSV/JSON.",
    pills: ["CSV", "JSON", "Dedupe", "Transform"],
  },
  {
    id: "vsecrets",
    name: "V-Secrets",
    tag: "Security API",
    status: "Soft launch ready",
    summary: "Gestión segura de secretos por proyecto con cifrado y auditoría.",
    pills: ["Secrets", "AES-256", "Audit", "API Keys"],
  },
];

const QUICK_ACTIONS = [
  {
    label: "Productos",
    prompt: "Muéstrame los productos disponibles de Evilink",
  },
  {
    label: "APIs",
    prompt: "Qué APIs tiene Evilink disponibles",
  },
  {
    label: "Integraciones",
    prompt: "Cómo puedo integrar productos de Evilink",
  },
  {
    label: "Status",
    prompt: "Cuál es el estado operativo del ecosistema Evilink",
  },
  {
    label: "Docs",
    prompt: "Dónde puedo consultar la documentación de Evilink",
  },
  {
    label: "Contacto",
    prompt: "Cómo puedo contactar a Evilink",
  },
];

const msgsHydratedRef = useRef(false);
const teaserStartedRef = useRef(false);

useEffect(() => {
  if (typeof window === "undefined") return;

  const label = PRODUCT_LABEL[product] ?? product;

  const raw =
    safeParse<Msg[]>(localStorage.getItem(LS_MSGS(product))) ?? [];

  // ✅ normaliza: solo mensajes válidos y fuerza product actual
  const savedMsgs: Msg[] = raw
    .filter((m) => m && typeof m.id === "string" && typeof m.text === "string")
    .map((m) => ({ ...m, product }));

  const hasWelcome = savedMsgs.some((m) => m.id === "welcome");

  const next: Msg[] = hasWelcome
    ? savedMsgs
    : [
        {
          id: "welcome",
          role: "assistant",
          text: `Listo ✅ Estás en Nexus. Puedo ayudarte a explorar productos, APIs, integraciones y estado del ecosistema Evilink`,
          ts: Date.now(),
          product,
        },
        ...savedMsgs,
      ];

  setMsgs(next);
  msgsHydratedRef.current = true;
}, [product]);

useEffect(() => {
  if (typeof window === "undefined") return;
  if (!msgsHydratedRef.current) return;      // ✅ no guardes antes de cargar
  if (msgs.length === 0) return;         // ✅ evita pisar con []

  localStorage.setItem(LS_MSGS(product), JSON.stringify(msgs));
}, [product, msgs]);

  
  const TEASER_SEEN_KEY = "nexus_teaser_seen_session_v1";

  const [teaserOpen, setTeaserOpen] = useState(false);
  const [teaserClosing, setTeaserClosing] = useState(false);

  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  function clearTeaserTimers() {
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    fadeTimerRef.current = null;
    hideTimerRef.current = null;
  }

  function markTeaserSeen() {
    try {
      sessionStorage.setItem(TEASER_SEEN_KEY, "1");
    } catch {}
  }

  function closeTeaser() {
    clearTeaserTimers();
    setTeaserClosing(true);

    window.setTimeout(() => {
      setTeaserOpen(false);
      setTeaserClosing(false);
      markTeaserSeen();
    }, 420);
  }

  function startTeaserAutoHide() {
    clearTeaserTimers();

    fadeTimerRef.current = window.setTimeout(() => {
      setTeaserClosing(true);
    }, 7000);

    hideTimerRef.current = window.setTimeout(() => {
      setTeaserOpen(false);
      setTeaserClosing(false);
      markTeaserSeen();
    }, 10000);
  }

useEffect(() => {
  if (typeof window === "undefined") return;

  if (teaserStartedRef.current) return;
  teaserStartedRef.current = true;

  const seen = (() => {
    try {
      return sessionStorage.getItem(TEASER_SEEN_KEY) === "1";
    } catch {
      return false;
    }
  })();

  if (seen) return;

  const openTimer = window.setTimeout(() => {
    setTeaserOpen(true);
    setTeaserClosing(false);
    startTeaserAutoHide();
  }, 900);

  return () => {
    window.clearTimeout(openTimer);
    clearTeaserTimers();
  };
}, []);


  useEffect(() => {
      const el = inputRef.current;
      if (!el) return;
      el.style.height = "0px";
      el.style.height = Math.min(el.scrollHeight, 96) + "px";
    }, [input]);

  //const sessionId = useMemo(() => "web", []);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Load state from localStorage
  useEffect(() => {
    setProduct("evi_link");
    localStorage.setItem(LS_PRODUCT_KEY, "evi_link");
    localStorage.setItem(LS_KEY, JSON.stringify({ product: "evi_link"}))
  }, []);

  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window === "undefined") return "web";
    const existing = localStorage.getItem(LS_SESSION_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    localStorage.setItem(LS_SESSION_KEY, created);
    return created;
  });

  function dedupeByFingerprint(list: Msg[]) {
   const seen = new Set<string>();
   const out: Msg[] = [];
   for (const m of list) {
    const key = `${m.role}|${m.ts}|${m.text}`;
     if (seen.has(key)) continue;
     seen.add(key);
     out.push(m);
    }
    return out;
  }

  useEffect(() => {
  if (!open) return;

  // si ya hay msgs guardados para este producto, no pegues history
  try {
    const cached = safeParse<Msg[]>(localStorage.getItem(LS_MSGS(product)));
    if (cached?.length) return;
  } catch {}

  (async () => {
    try {
      const r = await fetch(
        `/api/nexus/history?sessionId=${encodeURIComponent(sessionId)}&product=${encodeURIComponent(product)}&limit=30`,
        { cache: "no-store" }
      );
      const data = await r.json().catch(() => null);

      if (data?.ok && Array.isArray(data.messages)) {
        const loaded: Msg[] = data.messages.map((m: any) => ({
          id: crypto.randomUUID(), // aún sin backend id
          role: m.role === "assistant" ? "assistant" : "user",
          text: String(m.text ?? ""),
          ts: Date.parse(m.ts) || Date.now(),
          product,
        }));

        setMsgs(dedupeByFingerprint(loaded).sort((a,b)=>a.ts-b.ts));
      }
    } catch {}
  })();
}, [open, product, sessionId]);

  // Save state
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ product }));
  }, [product]);

  // Auto-scroll
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, msgs, loading]);

  // Focus input when open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const looksSensitive = (t: string) => {
     const s = t.toLowerCase();
     return (
      s.includes("sk_live_") || s.includes("sk_test_") ||
      s.includes("whsec_") ||
      s.includes("bearer ") ||
      s.includes("authorization:") ||
      s.includes("contraseña") ||
      s.includes("x-api-key") ||
      s.includes("password") ||
      s.includes("token") ||
      /\b\d{12,19}\b/.test(t.replace(/\s/g, "")) // posible tarjeta
    );
  };

  const lastSendRef = useRef(0);
  const lastPromptRef = useRef("");

   async function send() {
    const now = Date.now();
    if (now - lastSendRef.current < 600) return;
    lastSendRef.current = now;

  const text = input.trim();
    if (!text || loading) return;
    lastPromptRef.current = text;

    if (looksSensitive(text)) {
    const warn: Msg = {
      id: crypto.randomUUID(),
      role: "assistant",
      text:
        "⚠️ Por seguridad, no puedo procesar secretos. Borra tokens/llaves/passwords del mensaje y vuelve a intentarlo. " +
        "Si ya lo expusiste, rota esa llave/token.",
      ts: Date.now(),
      product,
    };

    // ✅ muestra el warning y corta el flujo (no llamar backend)
    setMsgs((m) => [...m, warn]);
    setLoading(false);
    return;
  }

   const sid = (sessionId && sessionId.trim()) ? sessionId : "web";
   const prod = (product && product.trim()) ? product : "curpify";

   console.log("SEND =>", { sid, prod, text });

   const userMsg: Msg = {
     id: crypto.randomUUID(),
     role: "user",
     text,
     ts: Date.now(),
     product: prod,
   };

   setMsgs((m) => [...m, userMsg]);
   setInput("");
   setLoading(true);

   try {
    const resp = await fetch("/api/nexus/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: sid, product: prod, message: text }),
  });

  const data = await resp.json().catch(() => ({}));
  console.log("Nexus MCP DATA", data);
 
    // 1) Errores legacy (si todavía llegan)
  if (!resp.ok || data?.ok === false) {
    const err = data?.error || `Error HTTP ${resp.status}`;
    setMsgs((m) => [...m, { 
      id: crypto.randomUUID(), 
      role: "assistant", 
      text: `⚠️ ${err}`, 
      ts: Date.now(), 
      product }]);
    return;
  }

  // 3) Legacy success
  const sections = data?.answer?.sections;
  const summary = 
    (typeof data?.answer?.summary === "string" && data.answer.summary.trim())
      ? data.answer.summary
      : (typeof data?.answer === "string" ? data.answer : "(sin respuesta)")
      console.log("LAST MSG SECTIONS", {
        summary,
        sections,
      });
  setMsgs((m) => [...m, { 
    id: crypto.randomUUID(), 
    role: "assistant", 
    text: summary, 
    ts: Date.now(), 
    product,
    sections: Array.isArray(sections) ? sections : undefined,
    traceId: data?.traceId,
    toolCalls: Array.isArray(data?.toolCalls) ? data.toolCalls : undefined,
    toolResults: Array.isArray(data?.toolResults) ? data.toolResults : undefined,
   }]);

    } catch (e: any) {
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: `⚠️ Error: ${e?.message ?? "unknown"}`, ts: Date.now(), product}]);
    } finally {
      setLoading(false);
    }
  }
  
  function dedupeMsgsById(list: Msg[]) {
    const seen = new Set<string>();
    const out: Msg[] = [];
    for (const m of list) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      out.push(m);
    }
    return out;
  }

  function startNewChat() {
    const label = PRODUCT_LABEL[product] ?? product;

    // 1) welcome + limpia UI
    const welcome: Msg = {
      id: "welcome",
      role: "assistant",
      text: `Listo ✅ Nuevo chat en Nexus. ¿Qué quieres explorar del ecosistema Evilink?`,
      ts: Date.now(),
      product,
    };

    setMsgs([welcome]);
    setInput("");
    setLoading(false);

    // 2) nuevo sessionId (esto es lo que evita que regrese history)
    const sid = crypto.randomUUID();
    setSessionId(sid);

    // 3) persistir sesión + (opcional) limpiar storage de msgs del producto
    try {
      localStorage.setItem(LS_SESSION_KEY, sid);
      localStorage.setItem(LS_MSGS(product), JSON.stringify([welcome]));
    } catch {}
  }

  function sectionsToPlainText(sections?: McpSection[]) {
  if (!Array.isArray(sections) || sections.length === 0) return "";

  return sections
    .map((s) => {
      if (s.type === "notice") {
        const badge =
          (s.kind ?? "info").toString().toUpperCase();
        return `${badge}: ${s.message ?? ""}${s.details ? `\n${s.details}` : ""}`.trim();
      }

      if (s.type === "kpi_grid") {
        const items = Array.isArray(s.items) ? s.items : [];
        const body = items
          .map((it) => {
            const label = String(it.label ?? "KPI");
            const value = it.value === null || it.value === undefined ? "—" : String(it.value);
            const unit = it.unit ? ` ${String(it.unit)}` : "";
            return `${label}: ${value}${unit}`;
          })
          .join("\n");

        return `${s.title ? `${s.title}\n` : ""}${body}`.trim();
      }

      if (s.type === "sparkline") {
        const items = Array.isArray(s.items) ? s.items : [];
        const body = items
          .map((it) => {
            const label = String(it.label ?? "Serie");
            const points = Array.isArray(it.points) ? it.points : [];
            const values = points
              .map((p) => Number(p?.v))
              .filter((n) => Number.isFinite(n));

            if (values.length < 2) return `${label}: sin histórico suficiente`;

            const first = values[0];
            const last = values[values.length - 1];
            const trend = last > first ? "alcista" : last < first ? "bajista" : "plana";

            return `${label}: tendencia ${trend}, último valor ${Number(last).toLocaleString()}`;
          })
          .join("\n");

        return `${s.title ? `${s.title}\n` : ""}${body}`.trim();
      }

      if (s.type === "text") {
        return `${s.title ? `${s.title}\n` : ""}${s.text ?? ""}`.trim();
      }

      return s.text ?? "";
    })
    .filter(Boolean)
    .join("\n\n");
}

  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1200);
    } catch {
      // fallback sin deprecated: muestra un prompt para copiar manualmente
      window.prompt("Copia este texto:", text);
    }
  }

  function askQuick(prompt: string) {
    setInput(prompt);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
  }

  function TypingIndicator() {
  return (
    <div
      style={{
        maxWidth: "70%",
        padding: "10px 12px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.8)",
        border: "1px solid rgba(255,255,255,0.10)",
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span>Nexus is typing</span>
      <span className="nexus-dots">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

function EcosystemIntro() {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 18,
        border: `1px solid ${EVILINK.border}`,
        background:
          `radial-gradient(120% 90% at 20% 0%, ${EVILINK.accent}1A 0%, rgba(0,0,0,0) 58%),
           linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))`,
        boxShadow: "0 18px 45px rgba(0,0,0,0.24)",
        display: "grid",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: EVILINK.accent,
              marginBottom: 5,
            }}
          >
            Evilink ecosystem
          </div>

          <div style={{ fontSize: 18, fontWeight: 950, lineHeight: 1.05 }}>
            Nexus
          </div>

          <div style={{ fontSize: 12, opacity: 0.72, marginTop: 4, lineHeight: 1.35 }}>
            Explora productos, APIs, integraciones y estado operativo del ecosistema.
          </div>
        </div>

        <div
          style={{
            alignSelf: "flex-start",
            padding: "5px 8px",
            borderRadius: 999,
            border: `1px solid ${EVILINK.border}`,
            background: "rgba(43,255,136,0.10)",
            color: EVILINK.accent,
            fontSize: 10,
            fontWeight: 900,
            whiteSpace: "nowrap",
          }}
        >
          soft launch
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => askQuick(a.prompt)}
            style={{
              border: `1px solid ${EVILINK.border}`,
              background: "rgba(255,255,255,0.055)",
              color: EVILINK.text,
              borderRadius: 999,
              padding: "7px 10px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 11, opacity: 0.65, fontWeight: 800 }}>
          Soft launch ready
        </div>

        {SOFT_LAUNCH_PRODUCTS.map((p) => (
          <div
            key={p.id}
            style={{
              padding: 10,
              borderRadius: 15,
              border: `1px solid ${EVILINK.border}`,
              background: "rgba(255,255,255,0.045)",
              display: "grid",
              gap: 7,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 950 }}>{p.name}</div>
                <div style={{ fontSize: 11, opacity: 0.65 }}>{p.tag}</div>
              </div>

              <div
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: EVILINK.accent,
                  whiteSpace: "nowrap",
                }}
              >
                Ready
              </div>
            </div>

            <div style={{ fontSize: 12, opacity: 0.78, lineHeight: 1.35 }}>
              {p.summary}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {p.pills.map((pill) => (
                <span
                  key={pill}
                  style={{
                    fontSize: 10,
                    padding: "3px 7px",
                    borderRadius: 999,
                    border: `1px solid ${EVILINK.border}`,
                    background: "rgba(255,255,255,0.045)",
                    opacity: 0.86,
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ desktop check (evita blur bug en iPhone)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // ✅ lock body scroll cuando está abierto (iOS friendly)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ✅ jerarquía fija
  const Z = {
    overlay: 9998,
    panel: 9999,
    teaser: 10001,
    fab: 10000,
  } as const;

  function buildSparkPath(values: number[], width: number, height: number) {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function SparkMini({ points }: { points: Array<{ t?: string; v?: number }> }) {
  const values = points
    .map((p) => Number(p?.v))
    .filter((n) => Number.isFinite(n));

  if (values.length < 2) {
    return (
      <div style={{ fontSize: 11, opacity: 0.65 }}>
        Sin histórico suficiente
      </div>
    );
  }

  const width = 180;
  const height = 30;
  const path = buildSparkPath(values, width, height);

  const up = values[values.length - 1] >= values[0];
  const stroke = up ? "#2BFF88" : "#FF6B6B";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="42"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

  function SectionView({ s }: { s: McpSection }) {
  if (s.type === "notice") {
    const kind = (s.kind ?? "info").toLowerCase();
    const isWarn = kind === "warning";
    const isErr = kind === "error";

    const bg = isErr
      ? "rgba(255, 80, 80, 0.12)"
      : isWarn
      ? "rgba(255, 180, 0, 0.12)"
      : "rgba(0, 229, 255, 0.10)";

    const badge = isErr ? "ERROR" : isWarn ? "WARN" : "INFO";

    return (
      <div style={{
        padding: "8px 10px",
        borderRadius: 14,
        border: `1px solid ${EVILINK.border}`,
        background: bg,
        fontSize: 11,
        lineHeight: 1.35
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 0.6,
            padding: "2px 8px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.10)",
            border: `1px solid ${EVILINK.border}`,
          }}>
            {badge}
          </span>
          <div style={{ fontWeight: 900 }}>
            {s.message ?? "Notice"}
          </div>
        </div>

        {s.details && (
          <div style={{ opacity: 0.8, marginTop: 6 }}>
            {s.details}
          </div>
        )}
      </div>
    );
  }

  if (s.type === "kpi_grid") {
    const items = Array.isArray(s.items) ? s.items : [];
    const cols =
      items.length === 1 ? "1fr" :
      items.length === 2 ? "repeat(2, minmax(0, 1fr))" :
      items.length === 3 ? "repeat(3, minmax(0, 1fr))" :
      "repeat(2, minmax(0, 1fr))";
      
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {s.title && (
          <div style={{ fontWeight: 900, fontSize: 12, opacity: 0.9 }}>
            {s.title}
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10
        }}>
          {items.map((it, idx) => {
            const tone = String((it as any).tone ?? "").toLowerCase();
            const toneColor =
              tone === "up"
                ? "#2BFF88"
                : tone === "down"
                ? "#FF6B6B"
                : EVILINK.text;

            return (
              <div
                key={idx}
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: `1px solid ${EVILINK.border}`,
                  background: "rgba(255,255,255,0.06)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
                }}
              >
                <div style={{ fontSize: 11, opacity: 0.75 }}>
                  {String(it.label ?? "KPI")}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: toneColor,
                    }}
                  >
                {it.value === null || it.value === undefined ? "—" : String(it.value)}
              </div>

              {it.unit ? (
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.75,
                    color: toneColor,
                  }}
                >
                  {String(it.unit)}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
        </div>
      </div>
    );
  }
  if (s.type === "sparkline") {
  const items = Array.isArray(s.items) ? s.items : [];

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {s.title && (
        <div style={{ fontWeight: 900, fontSize: 12, opacity: 0.9 }}>
          {s.title}
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((it, idx) => {
          const points = Array.isArray(it.points) ? it.points : [];
          const values = points
            .map((p) => Number(p?.v))
            .filter((n) => Number.isFinite(n));

          const last = values.length ? values[values.length - 1] : null;
          const first = values.length ? values[0] : null;
          const up = last !== null && first !== null ? last >= first : null;

          return (
            <div
              key={idx}
              style={{
                padding: "8px 10px",
                borderRadius: 14,
                border: `1px solid ${EVILINK.border}`,
                background: "rgba(255,255,255,0.05)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                display: "grid",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 11, opacity: 0.72 }}>
                  {String(it.label ?? "Serie")}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color:
                      up === null
                        ? EVILINK.text
                        : up
                        ? "#2BFF88"
                        : "#FF6B6B",
                  }}
                >
                  {last === null ? "N/D" : Number(last).toLocaleString()}
                </div>
              </div>

              <SparkMini points={points} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
  // default text (o cualquier otro)
  if (s.type === "text") {
    return (
      <div style={{
        padding: "10px 12px",
        borderRadius: 14,
        border: `1px solid ${EVILINK.border}`,
        background: "rgba(255,255,255,0.04)"
      }}>
        {s.title && <div style={{ fontWeight: 900, marginBottom: 6 }}>{s.title}</div>}
        {renderLiteMarkdown(s.text ?? "")}
      </div>
    );
  }

  // fallback por si llega algo nuevo
  return (
    <div style={{
      padding: "10px 12px",
      borderRadius: 14,
      border: `1px solid ${EVILINK.border}`,
      background: "rgba(255,255,255,0.03)",
      fontSize: 12,
      opacity: 0.85
    }}>
      <div style={{ fontWeight: 900 }}>{s.title ?? s.type}</div>
      {s.text ? <div style={{ marginTop: 6 }}>{renderLiteMarkdown(s.text)}</div> : null}
    </div>
  );
}

function DevMeta({ m }: { m: Msg }) {
  const toolResults = Array.isArray(m.toolResults) ? m.toolResults : [];

  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 14,
        border: `1px solid ${EVILINK.border}`,
        background: "rgba(255,255,255,0.04)",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 12, opacity: 0.9 }}>
        Dev
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        <div
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            border: `1px solid ${EVILINK.border}`,
            background: "rgba(255,255,255,0.05)",
            minWidth: 0,
          }}
        >
          <div style={{ fontSize: 11, opacity: 0.7 }}>Trace ID</div>
          <div style={{ fontSize: 12, fontWeight: 800, overflowWrap: "anywhere" }}>
            {m.traceId ?? "—"}
          </div>
        </div>

        <div
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            border: `1px solid ${EVILINK.border}`,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontSize: 11, opacity: 0.7 }}>Tools</div>
          <div style={{ fontSize: 12, fontWeight: 800 }}>
            {toolResults.length}
          </div>
        </div>
      </div>

      {toolResults.map((tr: any, idx: number) => (
        <div
          key={idx}
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            border: `1px solid ${EVILINK.border}`,
            background: "rgba(255,255,255,0.05)",
            display: "grid",
            gap: 4,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800 }}>
              {tr.tool ?? tr.toolCallId ?? "tool"}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: tr.ok ? "#2BFF88" : "#FF6B6B",
              }}
            >
              {tr.ok ? "OK" : "ERROR"}
            </div>
          </div>

          <div style={{ fontSize: 11, opacity: 0.75 }}>
            latency: {tr.latencyMs ?? "—"} ms
          </div>

          {tr.source && (
            <div style={{ fontSize: 11, opacity: 0.75 }}>
              source: {String(tr.source)}
            </div>
          )}

          {tr.provider && (
            <div style={{ fontSize: 11, opacity: 0.75 }}>
              provider: {String(tr.provider)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RenderAssistantMessage({ m, devMode }: { m: Msg; devMode: boolean }) {
  const sections = Array.isArray(m.sections) ? m.sections : [];

  const narrative =
    typeof m.text === "string" && m.text.trim() && m.text.trim() !== "(sin respuesta)"
      ? m.text
      : "";

  // El notice de cabecera va arriba; el resto de sections abajo.
  const headerNotices = sections.filter((s) => s.type === "notice");
  const bodySections = sections.filter((s) => s.type !== "notice");

  const hasAnySection = sections.length > 0;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {/* 1) Notice(s) de cabecera — procedencia arriba */}
      {headerNotices.map((s) => <SectionView key={s.id} s={s} />)}

      {/* 2) Narrativa — la voz, después del notice */}
      {narrative ? (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            border: `1px solid ${EVILINK.border}`,
            background: "rgba(255,255,255,0.04)",
            fontSize: 14,
            lineHeight: 1.45,
          }}
          >
         {renderLiteMarkdown(narrative)}
        </div>
      ) : null}

      {/* 3) Resto de sections (kpi_grid, text, etc.) — el detalle abajo */}
      {bodySections.map((s) => <SectionView key={s.id} s={s} />)}

      {/* Caso sin sections: recomendación pura -> solo narrativa (ya arriba).
          Si no había narrativa NI sections, muestra el text crudo como fallback. */}
      {!hasAnySection && !narrative ? <>{renderLiteMarkdown(m.text)}</> : null}

      {devMode ? <DevMeta m={m} /> : null}
    </div>
  );
}

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar Nexus" : "Abrir Nexus"}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          width: 64,
          height: 64,
          borderRadius: 999,
          background:
            `radial-gradient(circle at 35% 25%, ${EVILINK.accent}22 0%, rgba(0,0,0,0) 42%),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)),
            linear-gradient(180deg, ${EVILINK.panel} 0%, ${EVILINK.bg} 100%)`,
          border: `1px solid rgba(255,255,255,0.14)`,
          boxShadow: `0 18px 55px rgba(0,0,0,0.58), 0 0 34px ${EVILINK.accent}2B`,
          color: EVILINK.text,
          cursor: "pointer",
          zIndex: Z.fab,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.055)",
            border: `1px solid ${EVILINK.border}`,
            boxShadow: `inset 0 0 18px rgba(255,255,255,0.04), 0 0 18px ${EVILINK.accent}22`,
          }}
        >
          <img src="/nexus-bot-icon.png" width={34} height={34} alt="Nexus" />
        </div>
      </button>

      {/* Teaser */}
      {!open && teaserOpen && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            right: 88,
            bottom: 22,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            borderRadius: 999,
            background: "rgba(10, 18, 14, 0.92)",
            border: `1px solid ${EVILINK.border}`,
            color: EVILINK.text,
            boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
            cursor: "pointer",
            maxWidth: 320,

            // ✅ blur solo desktop
            backdropFilter: isDesktop ? "blur(10px)" : "none",
            WebkitBackdropFilter: isDesktop ? "blur(10px)" : "none",

            zIndex: Z.teaser,

            // fade-out
            opacity: teaserClosing ? 0 : 1,
            transform: teaserClosing ? "translateY(6px)" : "translateY(0)",
            transition: "opacity 420ms ease, transform 420ms ease",
          }}
        >
          <div
            style={{
              display: "grid",
              textAlign: "left",
              lineHeight: 1.1,
              fontFamily: `${geist.style.fontFamily}, system-ui, sans-serif`,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: "-0.015em",
              }}
            >
              Hola, soy Nexus
            </div>
            <div
              style={{
                opacity: 0.85,
                fontSize: 12,
                letterSpacing: "-0.01em",
              }}
            >
              Explora el ecosistema Evilink
            </div>
          </div>

          {/* Close X */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              closeTeaser();
              window.setTimeout(() => {
                try {
                sessionStorage.setItem(TEASER_SEEN_KEY, "1");
                } catch {}
              }, 420);
            }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${EVILINK.border}`,
              color: EVILINK.text,
              fontWeight: 900,
              lineHeight: 1,
              flex: "0 0 auto",
            }}
            aria-label="Cerrar mensaje"
            title="Cerrar"
          >
            ×
          </span>
        </button>
      )}

      {/* Overlay + Panel */}
      {open && (
        <div
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.28)",
            zIndex: Z.overlay,

            // ✅ blur solo desktop
            backdropFilter: isDesktop ? "blur(3px)" : "none",
            WebkitBackdropFilter: isDesktop ? "blur(3px)" : "none",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              right: 18,
              bottom: 88,
              width: "min(420px, calc(100vw - 36px))",
              height: "min(840px, calc(100vh - 140px))",
              background: `linear-gradient(180deg, ${EVILINK.panel} 0%, ${EVILINK.bg} 100%)`,
              borderRadius: 16,
              border: `1px solid ${EVILINK.border}`,
              boxShadow: `0 18px 55px rgba(0,0,0,0.55), 0 0 30px ${EVILINK.accent}22`,
              display: "grid",
              gridTemplateRows: "auto 1fr auto",
              overflow: "hidden",
              color: EVILINK.text,
              animation: "nexusPop 140ms ease-out",
              zIndex: Z.panel, // ✅ panel arriba del overlay
              fontFamily: `${geist.style.fontFamily}, system-ui, sans-serif`,
            }}
          >
            {/* Header */}
            <div style={{ display: "grid", gap: 10, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <strong style={{ fontSize: 16, color: "transparent",
                    fontFamily: `${sora.style.fontFamily}, ${geist.style.fontFamily}, system-ui, sans-serif`,
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    background: `linear-gradient(90deg, ${EVILINK.accent} 0%, ${EVILINK.accent2})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    textShadow: `0 0 18px ${EVILINK.accent}33`,
                   }}>Nexus</strong>
                  <span
                    style={{
                      fontSize: 12,
                      color: EVILINK.muted,
                      letterSpacing: "-0.01em",
                      lineHeight: "1.35",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    Evilink ecosystem assistant · powered by MCPOne
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={startNewChat}
                    style={{
                    borderRadius: 10,
                    padding: "6px 10px",
                    background: EVILINK.accent,
                    color: "#06110A",
                    border: "1px solid rgba(0,0,0,0.18)",
                    boxShadow: `0 0 12px ${EVILINK.accent}55`,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Clear
                </button>

                <button
                  onClick={() => setOpen(false)}
                  style={{
                    borderRadius: 10,
                    padding: "6px 10px",
                    background: EVILINK.accent,
                    color: "#06110A",
                    border: "1px solid rgba(0,0,0,0.18)",
                    boxShadow: `0 0 12px ${EVILINK.accent}55`,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

            {/* Product row */}
            <div style={{ display: "grid", gap: 10, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "4px 8px",
                        borderRadius: 999,
                        color: EVILINK.accent,
                        background: "rgba(43,255,136,0.10)",
                        border: `1px solid ${EVILINK.border}`,
                      }}
                    >
                      Ecosystem mode
                    </span>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 8px",
                        borderRadius: 999,
                        color: EVILINK.muted,
                        background: "rgba(255,255,255,0.045)",
                        border: `1px solid ${EVILINK.border}`,
                      }}
                    >
                      Docs-based answers
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                 {/* Clear + close buttons */}
              </div>
            </div>
          </div>

            {/* Messages */}
            <div
              ref={listRef}
              style={{
                padding: 12,
                overflow: "auto",
                display: "grid",
                gap: 10,
                background: `radial-gradient(120% 90% at 30% 10%, ${EVILINK.accent}10 0%, rgba(0,0,0,0) 55%), 
                linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.00))`,
              }}
            >
              <div style={{ padding: 12, display: "grid", gap: 10 }}>
                {msgs.length <= 1 && <EcosystemIntro />}
                {msgs.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      justifySelf: m.role === "user" ? "end" : "start",
                      maxWidth: "88%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    {/* bubble */}
                  <div
                    style={{
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: m.role === "user" ? EVILINK.bubbleUser : EVILINK.bubbleBot,
                    color: EVILINK.text,
                    border: `1px solid ${EVILINK.border}`,
                    whiteSpace: "pre-wrap",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.4,
                    fontSize: 14,
                  }}
                >
                  {m.role === "assistant"
                    ? <RenderAssistantMessage m={m} devMode={devMode} />
                    : renderLiteMarkdown(m.text)}
                </div>
                  {/* actions: solo assistant */}
                  {m.role === "assistant" && (
                <div style={{ display: "flex", gap: 8, opacity: 0.9 }}>
              <button
                onClick={() =>
                  copyText(
                    m.id,
                    (Array.isArray(m.sections) && m.sections.length)
                    ? sectionsToPlainText(m.sections)
                    : m.text
                  )
                }
                style={{
                  padding: "4px 8px",
                  minHeight: 0,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${EVILINK.border}`,
                  color: EVILINK.text,
                  fontSize: 12,
                  cursor: "pointer",
                }}
                  title="Copiar respuesta"
                  aria-label="Copiar respuesta"
              >
                {copiedId === m.id ? "✅ Copied" : "📋 Copy"}
              </button>
                </div>
                  )}
                </div>
                ))}
              </div>
            </div>
            {loading && (
              <div
                style={{
                  justifySelf: "start",
                  maxWidth: "88%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <TypingIndicator />
              </div>
            )}  
            
             <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    setInput(lastPromptRef.current);
                    setTimeout(() => send(), 0);
                  }}
                  disabled={loading || !lastPromptRef.current}
                  style={{
                    padding: "5px 9px",
                    minHeight: 0,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${EVILINK.border}`,
                    color: EVILINK.text,
                    fontSize: 12,
                    cursor: loading || !lastPromptRef.current ? "not-allowed" : "pointer",
                    opacity: loading || !lastPromptRef.current ? 0.4 : 0.82,
                  }}
                >
                  ↻ Retry
                </button>
              </div>

            {/* Input */}
            <div style={{ display: "grid", gap: 8, padding: 12, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Enter para enviar · Shift+Enter para salto de línea"
                rows={2}
                style={{
                  width: "100%",
                  resize: "none",
                  padding: 10,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${EVILINK.border}`,
                  color: EVILINK.text,
                  outline: "none",
                  boxShadow: `0 0 0 0 transparent`,
                  lineHeight: 1.3,
                  fontSize: 14,
                }}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.2 }}>
                  ⚠️ No pegues passwords, tokens, llaves API o datos bancarios.
                </span>
                <button
                  onClick={send}
                  disabled={!canSend}
                  style={{
                    opacity: canSend ? 1 : 0.5,
                    cursor: canSend ? "pointer" : "not-allowed",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: EVILINK.accent,
                    color: "#06110A",
                    border: "1px solid rgba(0,0,0,0.18)",
                    boxShadow: `0 0 12px ${EVILINK.accent}55`,
                    fontWeight: 700,
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Animación CSS inline */}
          <style jsx global>{`
            textarea:focus {
            box-shadow: 0 0 0 3px rgba(43, 255, 136, 0.18);
            border-color: rgba(43, 255, 136, 0.35);
          }

          .nexusDots::after {
            content: "…";
            animation: nexusDots 1.2s infinite;
          }
          @keyframes nexusDots {
            0%   { content: "."; }
            33%  { content: ".."; }
            66%  { content: "..."; }
            100% { content: "."; }
          }

          @keyframes nexusUp {
            from { transform: translateY(18px) scale(0.98); opacity: 0; }
            to   { transform: translateY(0) scale(1); opacity: 1; }
          }

          @keyframes nexusTeaserIn {
            from { transform: translateY(8px); opacity: 0; }
            to   { transform: translateY(0); opacity: 1; }
          }

          .nexus-dots {
            display: inline-flex;
            gap: 4px;
          }

          .nexus-dots i {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #2BFF88;
            opacity: 0.2;
            animation: nexusBlink 1.4s infinite both;
          }

          .nexus-dots i:nth-child(1) { animation-delay: 0s; }
          .nexus-dots i:nth-child(2) { animation-delay: 0.2s; }
          .nexus-dots i:nth-child(3) { animation-delay: 0.4s; }

          @keyframes nexusBlink {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }

          @keyframes nexusTeaserOut {
            from { transform: translateY(0); opacity: 1; }
            to   { transform: translateY(8px); opacity: 0; }
          }
        `}</style>
        </div>
      )}
    </>
  );
}
