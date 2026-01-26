// app/products/cryptolink/page.tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./cryptolink.module.css";
import PlanBuyButton from "./PlanBuyButton";

const PurchaseWidget = dynamic(() => import("./PurchaseWidget"), { ssr: false });
const PurchaseStatusBanner = dynamic(() => import("./PurchaseStatusBanner"), { ssr: false });


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
          {/* Tu botón separado (mejor UX y no rompe layout) */}
          <PlanBuyButton plan={planKey!} />
        </div>
      )}
    </div>
  );
}

export default function CryptoLinkPage() {
  const baseUrl = "https://cryptolink-production.up.railway.app";

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          {/* aquí si quieres el logo */}
          {/* <img src="/logo-horizontal.png" alt="evi_link devs" className={styles.logo} /> */}
        </div>

        <nav className="nav-links">
          <Link href="/">Inicio</Link>
          <Link href="/#products">← Volver</Link>
          <Link href="/products/cryptolink/docs">Docs</Link>
        </nav>
      </header>

      {/* HERO (ya NO usa className="page") */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <PurchaseStatusBanner />

          <h1 className={styles.h1}>CryptoLink</h1>
          <p className={styles.sub}>
            Precios cripto + streaming SSE en tiempo real, con límites por plan y headers “pro”.
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
      </section>

      {/* QUICKSTART (ya NO usa className="page") */}
      <section id="quickstart" className={styles.section}>
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
      </section>

      {/* PLANES (sin anidar purchase adentro) */}
      <section id="planes" className={styles.section}>
        <h2 className={styles.h2}>Planes</h2>

        <div className={styles.grid}>
          <PlanCard name="FREE" rpm="60" sse="1" symbols="3" />
          <PlanCard name="BUSINESS" rpm="600" sse="5" symbols="10" planKey="BUSINESS" />
          <PlanCard name="PRO" rpm="1200" sse="10" symbols="13" planKey="PRO" highlight />
        </div>

        <div className={styles.note}>
          <strong>Headers útiles:</strong> <code>X-Plan</code>, <code>X-RateLimit-*</code>, <code>X-Request-Id</code>.
        </div>
      </section>

      {/* PURCHASE (sección separada) */}
      <section id="purchase" className={styles.section}>
        <PurchaseStatusBanner />

        <h2 className={styles.h2}>Comprar</h2>
        <p className={styles.p}>Te enviamos tu API Key por correo en cuanto se confirme el pago.</p>
        <PurchaseWidget />
      </section>

      {/* DOCS (ya NO usa className="page") */}
      <section id="docs" className={styles.section}>
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
      </section>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} evi_link devs</span>
        <span className={styles.footerDot}>•</span>
        <span>CryptoLink en desarrollo activo</span>
      </footer>
    </main>
  );
}

