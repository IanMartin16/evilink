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
} from "./nexus.types";

import {
  buildSparkPath,
  dedupeByFingerprint,
  looksSensitive,
  safeParse,
  sectionsToPlainText,
} from "./nexus.utils";

import { EVILINK } from "./nexus.constants";
import { NexusMarkdown } from "./NexusMarkdown";
import { NexusSection } from "./NexusSections";
import { NexusMessage } from "./NexusMessage";
import { NexusComposer } from "./NexusComposer";
import styles from "./nexusWidget.module.css";

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

const WELCOME_TEXT =
  "Nexus está listo. Pregunta por productos, APIs y capacidades disponibles del ecosistema Evilink.";

function createWelcome(product: string): Msg {
  return {
    id: "welcome",
    role: "assistant",
    text: WELCOME_TEXT,
    ts: Date.now(),
    product,
  };
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

  const next: Msg[] = [
    createWelcome(product),
    ...savedMsgs.filter(
      (message) => message.id !== "welcome"
    ),
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

    const BLOCKED_SECRET_TEXT =
      "Por seguridad, Nexus no puede procesar credenciales o secretos. " +
      "Elimina tokens, API keys o contraseñas del mensaje antes de volver a enviarlo. " +
      "Si alguna credencial real fue expuesta, revócala o rótala.";

    if (looksSensitive(text)) {
      lastPromptRef.current = "";

    const warn: Msg = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: BLOCKED_SECRET_TEXT,
      ts: Date.now(),
      product,
    };

    setMsgs((current) => [...current, warn]);
    setLoading(false);
    return;
  }

  lastPromptRef.current = text;

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
    const welcome = createWelcome(product);

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
      className={styles.processingIndicator}
      role="status"
    >
      <span
        className={styles.processingDot}
        aria-hidden="true"
      />

      <span>Processing request</span>
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
      {/* FAB — Nexus Activity */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar Nexus" : "Abrir Nexus"}
        aria-expanded={open}
        title={open ? "Close Nexus" : "Open Nexus"}
        className={styles.fab}
        data-activity={loading ? "processing" : "idle"}
        style={{ zIndex: Z.fab }}
      >
        <span className={styles.fabCore}>
          <img
            src="/nexus-bot-icon.png"
            width={34}
            height={34}
            alt=""
            className={styles.fabIcon}
          />
        </span>
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
          className={styles.overlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${styles.shell} ${styles.panel}`}
            data-activity={loading ? "processing" : "idle"}
            style={{
              fontFamily:
              `${geist.style.fontFamily}, system-ui, sans-serif`,
            }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerIdentity}>
                <div className={styles.titleRow}>
                  <strong
                    className={styles.headerTitle}
                    style={{
                      fontFamily:
                        `${sora.style.fontFamily}, ${geist.style.fontFamily}, system-ui, sans-serif`,
                    }}
                  >
                    Nexus
                  </strong>

                  <span
                    className={styles.connectionStatus}
                    data-activity={loading ? "processing" : "idle"}
                    aria-live="polite"
                    title="Nexus interface status"
                  >
                    <span
                      className={styles.connectionDot}
                      aria-hidden="true"
                    />

                  {loading ? "Processing" : "Ready"}
                  </span>
                  </div>

                  <span className={styles.headerSubtitle}>
                    Evilink ecosystem interface
                  </span>
                </div>

                <div className={styles.headerActions}>
                  <button
                    onClick={startNewChat}
                    className={styles.headerAction}
                    title="New conversation"
                    aria-label="Nueva conversación"
                  >
                    ↺
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    className={styles.headerAction}
                    title="Close"
                    aria-label="Cerrar Nexus"
                  >
                    ×
                  </button>
                </div>
              </div>

            {/* Product row */}
            <div  className={styles.contextBar}
                  data-activity={loading ? "processing" : "idle"}>
              <span className={styles.contextPrimary}>
                Ecosystem
              </span>

              <span className={styles.contextItem}>
                Docs grounded
              </span>

              <span className={styles.contextItem}>
                MCP-One integration
              </span>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className={styles.conversation}
            >
              <div className={styles.messageList}>
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