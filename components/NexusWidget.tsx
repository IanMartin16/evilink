"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getNexusProductFromPath } from "@/lib/nexusProduct";

type Msg = { role: "user" | "assistant"; content: string };

export default function NexusWidget() {
  const pathname = usePathname();
  const product = useMemo(() => getNexusProductFromPath(pathname), [pathname]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const nextMessages = [...messages, { role: "user", content: text } as Msg];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/nexus/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "web", // luego lo hacemos real con uuid en localStorage/cookie
          product,
          message: text,
        }),
      });

      const data = await res.json();
      setMessages([...nextMessages, { role: "assistant", content: data?.answer ?? "No pude responder." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen((v) => !v)} style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999 }}>
        Nexus
      </button>

      {open && (
        <div style={{ position: "fixed", right: 16, bottom: 64, width: 360, height: 480, border: "1px solid #333", background: "#111", color: "#fff", zIndex: 9999, padding: 12 }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
            Producto: <b>{product}</b>
          </div>

          <div style={{ overflow: "auto", height: 360, paddingRight: 6 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ margin: "8px 0" }}>
                <b>{m.role === "user" ? "Tú" : "Nexus"}:</b> {m.content}
              </div>
            ))}
            {loading && <div style={{ opacity: 0.7 }}>Pensando...</div>}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escribe tu duda…"
              style={{ flex: 1 }}
            />
            <button onClick={send}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}
