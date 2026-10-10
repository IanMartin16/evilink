"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Geist, Sora } from "next/font/google";

import type {
  McpSection,
  Msg,
} from "@/components/nexus/nexus.types";

import {
  buildSparkPath,
  dedupeByFingerprint,
  looksSensitive,
  safeParse,
  sectionsToPlainText,
} from "@/components/nexus/nexus.utils";

import { EVILINK } from "@/components/nexus/nexus.constants";
import { NexusMarkdown } from "@/components/nexus/NexusMarkdown";
import { NexusSection } from "@/components/nexus/NexusSections";
import { NexusMessage } from "@/components/nexus/NexusMessage";
import { NexusComposer } from "@/components/nexus/NexusComposer";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});


const LS_KEY = "nexus_widget_state_v1";
const LS_PRODUCT_KEY = "nexus.product";
const LS_SESSION_KEY = "nexus.sessionId";
const LS_MSGS = (p: string) => `nexus_msgs_${p}`;
const LS_LAST_PRODUCT = "nexus.product";


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
                {msgs.map((message) => (
                  <NexusMessage
                    key={message.id}
                    message={message}
                    devMode={devMode}
                    copied={copiedId === message.id}
                    onCopy={copyText}
                  />
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
              <NexusComposer
                value={input}
                canSend={canSend}
                inputRef={inputRef}
                onChange={setInput}
                onSend={send}
              />
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
