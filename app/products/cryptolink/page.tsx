// app/products/cryptolink/page.tsx
"use client";

import dynamic from "next/dynamic";
import styles from "./cryptolink.module.css";
import PlanBuyButton from "./PlanBuyButton";
import React from "react";

const PurchaseWidget = dynamic(() => import("./PurchaseWidget"), { ssr: false });
const PurchaseStatusBanner = dynamic(() => import("./PurchaseStatusBanner"), { ssr: false });
const baseUrl = "https://cryptolink-production.up.railway.app";

function FreeKeyCard({ baseUrl }: { baseUrl: string }) {
  const FREE_DEMO_KEY =
    process.env.NEXT_PUBLIC_CRYPTOLINK_FREE_KEY || "cl_yEmprvVq49xxtiLLTpUktKLRF4vmqsmc";

  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(FREE_DEMO_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback silencioso
      setCopied(false);
    }
  }

  return (
    <div className={`${styles.panel} ${styles.freeCard}`}>
      <div className={styles.freeRow}>
        <div className={styles.freeTitle}>
          <div className={styles.h2} style={{ margin: 0 }}>
            Plan FREE <span style={{ opacity: 0.6 }}>(demo)</span>
          </div>
          <span className={styles.freePill}>2 symbols · 60 rpm · SSE off</span>
        </div>

        <a
          className={`${styles.btn} ${styles.btnGhost}`}
          href="https://cryptolink.mx/docs"
          target="_blank"
          rel="noreferrer"
        >
          Ver docs →
        </a>
      </div>

      <p className={styles.p} style={{ marginTop: 10, opacity: 0.92 }}>
        Copia esta API key para probar rápido. Está limitada a demo (para evitar abuso).
      </p>

      <div className={styles.freeKeyBox}>
        <code className={`${styles.freeKey} ${copied ? styles.copied : ""}`}>
          {FREE_DEMO_KEY}
        </code>

        <div className={styles.freeKeyActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={copy}
          >
            {copied ? "Copiada ✅" : "Copiar API Key"}
          </button>

          <a
            className={`${styles.btn} ${styles.btn}`}
            href={`${baseUrl}/v1/me`}
            target="_blank"
            rel="noreferrer"
            title="Ver plan y límites"
          >
            Ver /v1/me →
          </a>
        </div>
      </div>

      <div className={styles.note} style={{ marginTop: 12 }}>
        <strong>Quick test:</strong>{" "}
        <code>curl -s "{baseUrl}/v1/prices?symbols=BTC,ETH&fiat=MXN" -H "x-api-key: TU_API_KEY"</code>
      </div>
    </div>
  );
}

type PlanKey = "BUSINESS" | "PRO";

function PlanCard({
  name,
  rpm,
  sse,
  symbols,
  highlight,
  planKey,
}: {
  name: "FREE" | "BUSINESS" | "PRO";
  rpm: string;
  sse: string;
  symbols: string;
  highlight?: boolean;
  planKey?: PlanKey;
}) {
  return (
    <div className={`${styles.planCard} ${highlight ? styles.planCardHighlight : ""}`}>
      <div className={styles.planTop}>
        <div className={styles.planName}>{name}</div>
        {highlight ? <span className={styles.planBadge}>Recomendado</span> : null}
      </div>

      <div className={styles.planBody}>
        <div>Requests/min: <strong>{rpm}</strong></div>
        <div>SSE conexiones: <strong>{sse}</strong></div>
        <div>Max symbols: <strong>{symbols}</strong></div>
      </div>

      {name === "FREE" ? (
        <div className={styles.planNote}>FREE se usa con API key demo (sin checkout).</div>
      ) : (
        <div className={styles.planCta}>
          <PlanBuyButton plan={planKey!} />
        </div>
      )}
    </div>
  );
}

export default function CryptoLinkPage() {
  const baseUrl = "https://cryptolink-production.up.railway.app";

  return (
    <main className="page">
      {/* Header */}
      <header className="nav">
          <div className="logo-block">
           <img src="/logo-horizontal.png" alt="evi_link devs logo" />
          </div>
             <nav className="nav-links">
              <a href="/">Inicio</a>
              <a href="/#products">← Volver</a>
              <a href="/products">Productos</a>
             </nav>
        </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <div className={styles.heroLeft}>
              <PurchaseStatusBanner />

              <h1 className={styles.h1}>CryptoLink</h1>
              <p className={styles.sub}>
                Precios cripto + streaming SSE en tiempo real, con límites por plan y headers “pro”.
              </p>
              <p className={styles.tip}>
                En venta: <strong>CryptoLink API (V1)</strong>. El Dashboard V2 es <strong>showcase/reference-only</strong> por ahora.
              </p>

              <div className={styles.badges}>
                <span className={styles.badge}>Base URL: {baseUrl.replace("https://", "")}</span>
                <span className={styles.badge}>Auth: x-api-key</span>
              </div>

              <div className={styles.actions}>
                <a className={`${styles.btn} ${styles.btnSecondary}`} href="#quickstart">
                  Quickstart
                </a>
                <a className={`${styles.btn} ${styles.btnGhost}`} href="#planes">
                  Planes
                </a>
                <a className={`${styles.btn} ${styles.btnSecondary}`} href="#purchase">
                  Comprar
                </a>
                <a className={`${styles.btn} ${styles.btnGhost}`} href="#docs">
                  Docs
                </a>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.panel}>
                <div className={styles.h2}>Checklist rápido</div>
                <ul className={styles.list}>
                  <li>Obtén tu API Key (por email tras checkout).</li>
                  <li>Prueba REST con <code>x-api-key</code>.</li>
                  <li>Para SSE usa <code>curl -N</code> y deja la conexión abierta.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICKSTART */}
      <section id="quickstart" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.h2}>Quickstart</h2>
          <p className={styles.list}>
            Usa tu <code>x-api-key</code>. Si aún no tienes, te la enviamos por correo tras el checkout.
          </p>

          <div className={styles.codeBox}>
            <pre className={styles.list}>
            {`# REST
              curl -s "${baseUrl}/v1/prices?symbols=BTC,ETH&fiat=MXN" \\
                -H "x-api-key: TU_API_KEY"

              # SSE (stream)
              curl -N "${baseUrl}/v1/stream/prices?symbols=BTC,ETH&fiat=MXN" \\
                -H "x-api-key: TU_API_KEY"`}
            </pre>
          </div>

          <p className={styles.tip}>
            Tip: en SSE puedes cancelar con <code>Ctrl+C</code> y reconectar cuando quieras.
          </p>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.h2}>Planes</h2>

          <div className={styles.grid}>
            <PlanCard name="FREE" rpm="60" sse="off" symbols="2" />
            <PlanCard name="BUSINESS" rpm="600" sse="5" symbols="15" planKey="BUSINESS" />
            <PlanCard name="PRO" rpm="1200" sse="10" symbols="25" planKey="PRO" highlight />
          </div>

          <div className={styles.note}>
            <strong>Headers útiles:</strong> <code>X-Plan</code>, <code>X-RateLimit-*</code>, <code>X-Request-Id</code>.
          </div>
        </div>
      </section>

      {/* PURCHASE */}
      <section id="purchase" className={styles.section}>
        <div className={styles.container}>
          <PurchaseStatusBanner />
          <h2 className={styles.h2}>Comprar</h2>
              {/* ✅ Nuevo: FREE demo */}
              <FreeKeyCard baseUrl={baseUrl}/>
          <p className={styles.p}>Te enviamos tu API Key por correo en cuanto se confirme el pago.</p>
          <PurchaseWidget />
        </div>
      </section>

      {/* DOCS */}
      <section id="docs" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.h2}>Docs</h2>

          <div className={styles.twoCols}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>Headers</div>
              <ul className={styles.list}>
                <li><code>X-Plan</code></li>
                <li>
                  <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>,{" "}
                  <code>X-RateLimit-Reset</code>, <code>X-RateLimit-Used</code>
                </li>
                <li><code>X-Request-Id</code> para debug</li>
              </ul>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>Endpoints</div>
              <ul className={styles.list}>
                <li><code>/v1/prices</code> (prices por symbols/fiat)</li>
                <li><code>/v1/price</code> (uno)</li>
                <li><code>/v1/stream/prices</code> (SSE)</li>
                <li><code>/v1/symbols</code>, <code>/v1/fiats</code>, <code>/v1/meta</code></li>
                <li><code>/v1/me</code> (plan + límites)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <span>© {new Date().getFullYear()} evi_link devs</span>
          <span className={styles.footerDot}>•</span>
          <span>CryptoLink en desarrollo activo</span>
        </div>
      </footer>
    </main>
  );
}

