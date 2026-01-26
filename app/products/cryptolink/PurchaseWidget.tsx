"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./PurchaseWidget.module.css";

const PRICE = {
  BUSINESS: process.env.NEXT_PUBLIC_CRYPTOLINK_PRICE_BUSINESS || "MXN 99/mes",
  PRO: process.env.NEXT_PUBLIC_CRYPTOLINK_PRICE_PRO || "MXN 199/mes",
} as const;

type Plan = "BUSINESS" | "PRO";

export default function PurchaseWidget() {
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("BUSINESS");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const emailTrim = useMemo(() => email.trim().toLowerCase(), [email]);

  function isValidEmail(e: string) {
    return !!e && e.includes("@") && e.includes(".");
  }

  // Permite preseleccionar plan desde la URL: ?plan=BUSINESS o ?plan=PRO
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("plan");
    if (p?.toUpperCase() === "PRO") setSelectedPlan("PRO");
    if (p?.toUpperCase() === "BUSINESS") setSelectedPlan("BUSINESS");
  }, []);

  // ✅ HACE QUE LOS BOTONES EXTERNOS FUNCIONEN
  useEffect(() => {
    (window as any).__cryptolinkPurchase = (plan: Plan) => {
      setSelectedPlan(plan);

      const el = document.getElementById("purchase");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });

      // enfoque al input (con un mini delay para que ya esté en vista)
      setTimeout(() => emailRef.current?.focus(), 250);
    };

    return () => {
      // cleanup para no dejar basura si cambias de página
      delete (window as any).__cryptolinkPurchase;
    };
  }, []);

  async function startCheckout() {
    setErr(null);

    if (!isValidEmail(emailTrim)) {
      setErr("Pon un email válido para enviarte tu API key.");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`/api/cryptolink/checkout?plan=${selectedPlan}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: emailTrim }),
      });

      const data = await r.json().catch(() => null);
      if (!r.ok || !data?.url) throw new Error(data?.error || `Checkout failed (${r.status})`);

      window.location.href = data.url;
    } catch (e: any) {
      setErr(e?.message || "No se pudo iniciar el checkout.");
      setLoading(false);
    }
  }

  return (
    <div id="purchase" className={styles.wrap}>
      <div className={styles.title}>Comprar</div>
      <div className={styles.sub}>
        Checkout con Stripe. Cuando se confirme el pago, recibes tu API key por correo.
      </div>

      <div className={styles.row}>
        <input
          ref={emailRef}
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          type="email"
          autoComplete="email"
        />

        <div className={styles.pills}>
          <button
            type="button"
            className={`${styles.pill} ${selectedPlan === "BUSINESS" ? styles.pillActive : ""}`}
            onClick={() => setSelectedPlan("BUSINESS")}
          >
            BUSINESS · {PRICE.BUSINESS}
          </button>

          <button
            type="button"
            className={`${styles.pill} ${selectedPlan === "PRO" ? styles.pillActive : ""}`}
            onClick={() => setSelectedPlan("PRO")}
          >
            PRO · {PRICE.PRO}
          </button>
        </div>

        <button className={styles.buy} onClick={startCheckout} disabled={loading}>
          {loading ? "Abriendo Stripe..." : `Comprar ${selectedPlan}`}
        </button>
      </div>

      {err && <div className={styles.err}>{err}</div>}
      <div className={styles.note}>
        Tip: Puedes llegar aquí directo con <code>?plan=PRO#purchase</code>
      </div>
    </div>
  );
}

