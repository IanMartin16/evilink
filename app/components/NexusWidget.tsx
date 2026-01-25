"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

type Product = "curpify" | "cryptolink" | "evilink";
type Msg = {id: string; role: "user" | "assistant"; text: string; ts: number, product: string;};

const LS_KEY = "nexus_widget_state_v1";
const LS_PRODUCT_KEY = "nexus.product";
const LS_SESSION_KEY = "nexus.sessionId";

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

  const [msgs, setMsgs] = useState<Msg[]>([
    {id:"welcome", role: "assistant", text: "Hola 👋 Soy Nexus. Pregúntame sobre Curpify, CryptoLink o evi_link.", ts: Date.now (), product: "curpify" },
  ]);

  const [product, setProduct] = useState<string>(() => {
    if (typeof window === "undefined") return "curpify";
    return localStorage.getItem(LS_PRODUCT_KEY) || "curpify";
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_PRODUCT_KEY, product);
  }, [product]);



  const DISCLAIMER_KEY = "nexus_disclaimer_dismissed_v1";

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISCLAIMER_KEY) === "1";
      setShowDisclaimer(!dismissed);
    } catch {
      setShowDisclaimer(true);
    }
  }, []);

  const [teaserOpen, setTeaserOpen] = useState(true);
  const [teaserClosing, setTeaserClosing] = useState(false);

  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const startTeaserAutoHide = () => {
    // limpia timers previos (por si acaso)
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);

  const fadeAtMs = 4000;
  const hideAtMs = 5000;

  fadeTimerRef.current = window.setTimeout(() => setTeaserClosing(true), fadeAtMs);
  hideTimerRef.current = window.setTimeout(() => {
    setTeaserOpen(false);
    setTeaserClosing(false);
    localStorage.setItem("nexus_teaser_seen", "1");
  }, hideAtMs);
};


useEffect(() => {
  if (typeof window === "undefined") return;

  const seen = localStorage.getItem("nexus_teaser_seen");
  if (seen) return;

  setTeaserOpen(true);
  setTeaserClosing(false);
  startTeaserAutoHide();

  return () => {
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
  };
}, []);  


  //const sessionId = useMemo(() => "web", []);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Load state from localStorage
  useEffect(() => {
    const saved = safeParse<{ product: Product; msgs: Msg[] }>(localStorage.getItem(LS_KEY));
    if (saved?.product) setProduct(saved.product);
    if (saved?.msgs?.length) setMsgs(saved.msgs);
  }, []);

  const [sessionId] = useState<string>(() => {
    if (typeof window === "undefined") return "web";
    const existing = localStorage.getItem(LS_SESSION_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    localStorage.setItem(LS_SESSION_KEY, created);
    return created;
  });


  useEffect(() => {
  if (!open) return;

  (async () => {
    try {
      const r = await fetch(
        `/api/nexus/history?sessionId=${encodeURIComponent(sessionId)}&product=${encodeURIComponent(product)}&limit=30`,
        { cache: "no-store" }
      );
      const data = await r.json().catch(() => null);

      if (data?.ok && Array.isArray(data.messages)) {
        setMsgs(
          data.messages.map((m: any) => ({
            id: crypto.randomUUID(),
            role: m.role === "assistant" ? "assistant" : "user",
            text: String(m.text ?? ""),
            ts: Date.parse(m.ts) || Date.now(),
            product,
          }))
        );
      }
    } catch {
      // si falla, no pasa nada
    }
  })();
}, [open, product, sessionId]);

  // Save state
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ product, msgs }));
  }, [product, msgs]);

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
      s.includes("x-api-key") ||
      s.includes("password") ||
      s.includes("token") ||
      /\b\d{12,19}\b/.test(t.replace(/\s/g, "")) // posible tarjeta
    );
  };

   async function send() {
   const text = input.trim();
   if (!text || loading) return;

   if (looksSensitive(text)) {
     const warn: Msg = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "⚠️ Por seguridad, no puedo procesar secretos. Borra tokens/llaves/passwords del mensaje y vuelve a intentarlo (rota la llave si ya se expuso).",
      ts: Date.now(),
      product,
    };
    setMsgs((m) => [...m, warn]);
    setInput("");
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

      if (!resp.ok || data?.ok === false) {
        const err = data?.error || `Error HTTP ${resp.status}`;
        setMsgs((m) => [...m, {id: crypto.randomUUID(), role: "assistant", text: `⚠️ ${err}`, ts: Date.now(), product }]);
      } else {
        setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: data?.answer ?? "(sin respuesta)", ts: Date.now(), product }]);
      }
    } catch (e: any) {
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: `⚠️ Error: ${e?.message ?? "unknown"}`, ts: Date.now(), product}]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMsgs([{id: crypto.randomUUID(), role: "assistant", text: "Listo ✅ ¿Qué quieres preguntar ahora?", ts: Date.now(), product}]);
  }

  return (
    <>
      {/* FAB */}
      <button
  onClick={() => setOpen((v) => !v)}
  aria-label="Abrir Nexus"
  style={{
    position: "fixed",
    right: 18,
    bottom: 18,
    width: 62,
    height: 62,
    borderRadius: 999,
    background: `linear-gradient(180deg, ${EVILINK.panel} 0%, ${EVILINK.bg} 100%)`,
    border: `1px solid ${EVILINK.border}`,
    boxShadow: `0 18px 55px rgba(0,0,0,0.55), 0 0 30px ${EVILINK.accent}22`,
    color: EVILINK.text,
    cursor: "pointer",
    zIndex: 9999,
    display: "grid",
    placeItems: "center",
  }}
>
  {/* Icono simple tipo “N” */}
  <span style={{
    fontWeight: 900,
    letterSpacing: 0.5,
    color: EVILINK.text,
    textShadow: `0 0 18px ${EVILINK.accent}88`,
  }}>
    N
  </span>
  </button>
  {!open && teaserOpen && (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setOpen(true);
      }}
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
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        animation: teaserClosing
          ? "nexusTeaserOut 1000ms ease-in forwards"
          : "nexusTeaserIn 260ms ease-out",
        zIndex: 99999,
        userSelect: "none",
      }}
      aria-label="Abrir Nexus"
      title="Abrir Nexus"
    >
      <div style={{ display: "grid", textAlign: "left", lineHeight: 1.1 }}>
        <div style={{ fontWeight: 800, fontSize: 13 }}>Hola, soy Nexus</div>
        <div style={{ opacity: 0.85, fontSize: 12 }}>¿Tienes alguna duda?</div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setTeaserClosing(true);
          window.setTimeout(() => {
            setTeaserOpen(false);
            setTeaserClosing(false);
          }, 650);
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
          cursor: "pointer",
        }}
        aria-label="Cerrar mensaje"
        title="Cerrar"
      >
        ×
      </button>
    </div>
  )}

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.22)",
            backdropFilter: "blur(3px)",
            zIndex: 9999,
          }}
        >
          {/* Panel */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              right: 18,
              bottom: 88, // deja espacio para el FAB
              width: "min(420px, calc(100vw - 36px))",
              height: "min(640px, calc(100vh - 140px))",
              background: `linear-gradient(180deg, ${EVILINK.panel} 0%, ${EVILINK.bg} 100%)`,
              borderRadius: 16,
              border: `1px solid ${EVILINK.border}`,
              boxShadow: `0 18px 55px rgba(0,0,0,0.55), 0 0 30px ${EVILINK.accent}22`,
              display: "grid",
              gridTemplateRows: "auto auto 1fr auto",
              overflow: "hidden",
              color: EVILINK.text,
              animation: "nexusPop 140ms ease-out",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ fontSize: 14, color: EVILINK.text }}>Nexus</strong>
                <span style={{ fontSize: 12, color: EVILINK.muted }}>Asistente de evi_link (beta)</span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={clearChat}
                  style={{
                    borderRadius: 10,
                    padding: "6px 10px",
                    background: EVILINK.accent,
                    color: "#06110A",
                    border: "1px solid rgba(0,0,0,0.18)",
                    boxShadow: `0 0 18px ${EVILINK.accent}55`,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setOpen(false) } 
                  style={{
                    borderRadius: 10,
                    padding: "6px 10px",
                    background: EVILINK.accent,
                    color: "#06110A",
                    border: "1px solid rgba(0,0,0,0.18)",
                    boxShadow: `0 0 18px ${EVILINK.accent}55`,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {showDisclaimer && (
             <div
              style={{
                margin: "10px 12px 0",
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${EVILINK.border}`,
                background: `linear-gradient(135deg, ${EVILINK.accent}18 0%, ${EVILINK.accent2}10 45%, rgba(255,255,255,0.05) 100%)`,
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 10,
                alignItems: "start",
              }}
            >
              {/* Icono */}
                <div
                  style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${EVILINK.border}`,
                  boxShadow: `0 0 18px ${EVILINK.accent}22`,
                  marginTop: 1,
              }}
              aria-hidden="true"
            >
              <span style={{ color: EVILINK.text, fontWeight: 900 }}>i</span>
            </div>

            {/* Texto */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: EVILINK.text, lineHeight: 1.1 }}>
                  Usamos IA generativa
                </div>
                <span style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.2 }}>
                 ⚠️ Seguridad: no pegues passwords, tokens, llaves API o datos bancarios.
                </span>
              </div>

              {/* Close */}
              <button
                onClick={() => {
                  try {
                      localStorage.setItem(DISCLAIMER_KEY, "1");
                    } catch {}
                      setShowDisclaimer(false);
                    }}
                    aria-label="Cerrar aviso"
                    style={{
                      border: `1px solid ${EVILINK.border}`,
                      background: "rgba(255,255,255,0.06)",
                      color: EVILINK.text,
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      cursor: "pointer",
                    }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Product row */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "0 12px 12px 12px" }}>
              <label style={{ fontSize: 12, opacity: 0.75 }}>Producto</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value as Product)}
                style={{ padding: 8, borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)" }}
              >
                <option value="curpify">curpify</option>
                <option value="cryptolink">cryptolink</option>
                <option value="evilink">evilink</option>
              </select>

              <div style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
                Respuestas basadas en docs
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
              <div style={{ overflow: "auto", padding: 12, display: "grid", gap: 10 }}></div>
              {msgs.map((m) => (
                <div
                  key={m.ts}
                  style={{
                    justifySelf: m.role === "user" ? "end" : "start",
                    maxWidth: "88%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: m.role === "user" ? EVILINK.bubbleUser : EVILINK.bubbleBot,
                    color: EVILINK.text,
                    border: `1px solid ${EVILINK.border}`,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.4,
                    fontSize: 14,
                  }}
                >
                  {renderLiteMarkdown(m.text)}
                </div>
              ))}
              {loading && (
                <div style={{ justifySelf: "start", opacity: 0.75, fontSize: 13 }}>
                  Nexus está pensando…
                </div>
              )}
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
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  No compartas datos sensibles.
                </span>
                <button
                  onClick={send}
                  disabled={loading}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: EVILINK.accent,
                    color: "#06110A",
                    border: "1px solid rgba(0,0,0,0.18)",
                    boxShadow: `0 0 18px ${EVILINK.accent}55`,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Enviar
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

          @keyframes nexusUp {
            from { transform: translateY(18px) scale(0.98); opacity: 0; }
            to   { transform: translateY(0) scale(1); opacity: 1; }
          }

          @keyframes nexusTeaserIn {
            from { transform: translateY(8px); opacity: 0; }
            to   { transform: translateY(0); opacity: 1; }
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
