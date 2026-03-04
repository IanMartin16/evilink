// app/page.tsx
import Link from "next/link";

export default function Home() {
  type Status = "DISPONIBLE" | "LANZAMIENTO" | "EN DESARROLLO";

  const PRODUCTS: Array<{
    key: string;
    name: string;
    status: Status;
    desc: string;
    bullets: string[];
    links?: Array<{ label: string; href: string; external?: boolean }>;
    tag?: string;
    muted?: boolean;
  }> = [
    {
      key: "cryptolink",
      name: "CryptoLink API",
      status: "DISPONIBLE",
      desc: "Precios cripto + streaming SSE en tiempo real, API Keys, rate limiting por plan y checkout con Stripe.",
      bullets: [
        "REST + SSE (ping/price)",
        "Headers pro: X-RateLimit-* · X-Request-Id · X-Plan",
        "SDK JS oficial + docs públicas",
      ],
      links: [
        { label: "Comprar →", href: "/products/cryptolink" },
        { label: "Docs →", href: "https://cryptolink.mx/docs", external: true },
      ],
      tag: "Spring Boot · Railway · Stripe · Resend · Postgres",
    },
    {
      key: "curpify",
      name: "Curpify API",
      status: "LANZAMIENTO",
      desc: "Validación de CURP para integraciones en México. Lista para apps, CRMs y flujos fintech.",
      bullets: [
        "Validación rápida y consistente",
        "Respuestas JSON estandarizadas",
        "Curpify Lite: 4.99 USD · 100 validaciones/día",
      ],
      links: [{ label: "Ver producto →", href: "https://curpify.com", external: true }],
      tag: "Next.js · Postgres · Stripe",
    },
    {
      key: "nexus",
      name: "Nexus",
      status: "EN DESARROLLO",
      desc: "El cerebro del ecosistema evi_link devs: assistant + governance + capa de ingesta para productos y docs.",
      bullets: [
        "Knowledge-driven (RAG) sobre docs oficiales",
        "MCP-ready (roadmap)",
        "No hace cómputo pesado: enruta, explica y coordina",
      ],
      links: [
        { label: "Roadmap →", href: "#roadmap" },
        {
          label: "Join waitlist →",
          href: "mailto:support@evilink.dev?subject=Nexus%20waitlist",
          external: true,
        },
      ],
      tag: "Beta cerrada · roadmap en construcción",
      muted: true,
    },
    {
      key: "social_link",
      name: "Social_Link API",
      status: "EN DESARROLLO",
      desc: "Señales sociales + sentimiento + movers para alimentar Market Intelligence (CryptoLink + Social_Link → Nexus).",
      bullets: [
        "Trends / themes / mood signals",
        "Fuentes: social + news (roadmap)",
        "Integración con Nexus (MCP-ready)",
      ],
      links: [
        { label: "Roadmap →", href: "#roadmap" },
        {
          label: "Notify me →",
          href: "mailto:support@evilink.dev?subject=Social_Link%20waitlist",
          external: true,
        },
      ],
      tag: "Beta cerrada · roadmap en construcción",
      muted: true,
    },
  ];

  const badgeClass = (s: Status) => {
    if (s === "DISPONIBLE") return "badge badge-live";
    if (s === "LANZAMIENTO") return "badge badge-launch";
    return "badge badge-dev";
  };

  return (
    <main className="page">
      {/* NAVBAR */}
      <header className="nav">
        <div className="logo-block">
          <img src="/logo-horizontal.png" alt="evi_link devs logo" />
        </div>

        <nav className="nav-links">
          <a href="#ecosystem">Ecosystem</a>
          <a href="/products">Productos</a>
          <a href="#quickstart">Quickstart</a>
          <Link href="#about">Sobre</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Infra de APIs y productos <br />
            para developers.
          </h1>

          <p>
            evi_link devs es un ecosistema “developer-first”: construimos APIs listas para producción con contratos
            claros, seguridad desde el MVP y obsesión real por el detalle.
          </p>

          {/* ✅ Pills (Stripe/Vercel vibe) */}
          <div className="pills">
            <span className="pill">
              <b>Release:</b> CryptoLink v1
            </span>
            <span className="pill">
              <b>Auth:</b> x-api-key
            </span>
            <span className="pill">
              <b>Streaming:</b> SSE
            </span>
          </div>

          <div className="hero-actions">
            <a href="#ecosystem" className="btn-secondary">
              Explorar ecosystem
            </a>

            <a href="/products/cryptolink" className="btn-secondary">
              Empezar con CryptoLink
            </a>
          </div>

          <p className="hero-note">
            ✦ Último release: <strong>CryptoLink v1</strong> (SSE + API Keys + Stripe + rate limiting).
          </p>
        </div>

        <div className="hero-card">
          <h2>Arquitectura base</h2>
          <ul>
            <li>Next.js (UI / gateway / BFF ligero)</li>
            <li>Servicios core: Spring Boot / Python según el flujo</li>
            <li>OpenAPI · Auth · Rate limiting · Observabilidad mínima</li>
          </ul>
          <p className="hero-card-foot">
            Optimizar primero, escalar después: costos controlados sin sacrificar robustez.
          </p>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section id="ecosystem" className="section">
        <h2>Ecosystem</h2>
        <p className="section-intro">
          Una idea simple: <strong>data + signals + AI</strong>. Puedes usar solo la API, o ir por la plataforma
          completa.
        </p>

        <div className="cards">
          <article className="card">
            <div className="card-top">
              <h3>CryptoLink</h3>
              <span className="badge badge-live">LIVE</span>
            </div>
            <p>Market data cripto: REST + SSE, planes por API key y DX de primer nivel.</p>
            <ul className="card-list">
              <li>✔ Precios batch + streaming</li>
              <li>✔ SDK JS oficial</li>
              <li>✔ Docs públicas en cryptolink.mx</li>
            </ul>
            <div className="card-actions">
              <a className="btn-mini" href="/products/cryptolink">
                Comprar →
              </a>
              <a className="btn-mini" href="https://cryptolink.mx/docs" target="_blank" rel="noreferrer">
                Docs →
              </a>
            </div>
            <p className="card-tag">Spring Boot · Railway · Stripe</p>
          </article>

          <article className="card card-muted">
            <div className="card-top">
              <h3>Social_Link</h3>
              <span className="badge badge-dev">EN DESARROLLO</span>
            </div>
            <p>Señales de sentimiento + trends para construir Market Intelligence real.</p>
            <ul className="card-list">
              <li>✔ Movers & themes</li>
              <li>✔ Roadmap: social + news</li>
              <li>✔ MCP-ready para Nexus</li>
            </ul>
            <div className="card-actions">
              <a
                className="btn-mini"
                href="mailto:support@evilink.dev?subject=Social_Link%20waitlist"
                target="_blank"
                rel="noreferrer"
              >
                Notify me →
              </a>
            </div>
            <p className="card-tag">Beta cerrada</p>
          </article>

          <article className="card card-muted">
            <div className="card-top">
              <h3>Nexus</h3>
              <span className="badge badge-dev">EN DESARROLLO</span>
            </div>
            <p>AI interface del ecosistema: explicación + gobernanza + ingesta (no “heavy compute”).</p>
            <ul className="card-list">
              <li>✔ RAG sobre docs oficiales</li>
              <li>✔ MCP como upgrade natural</li>
              <li>✔ Acceso privilegiado a CryptoLink/Social_Link</li>
            </ul>
            <div className="card-actions">
              <a
                className="btn-mini"
                href="mailto:support@evilink.dev?subject=Nexus%20waitlist"
                target="_blank"
                rel="noreferrer"
              >
                Join waitlist →
              </a>
            </div>
            <p className="card-tag">Beta cerrada</p>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
        <section className="section">
          <h2>Cómo funciona</h2>
          <p className="section-intro">Para el usuario final parece magia. Para developers es un pipeline claro.</p>

          <div className="flow">
            <article className="flowCard">
              <div className="flowTop">
                <span className="flowIcon" aria-hidden>📈</span>
                <div>
                  <div className="flowTitle">CryptoLink</div>
                  <div className="flowSub">Market data</div>
                </div>
              </div>
              <ul className="flowList">
                <li>REST + SSE</li>
                <li>Batch + stream</li>
                <li>Headers pro</li>
              </ul>
            </article>

            <div className="flowArrow" aria-hidden>→</div>

            <article className="flowCard muted">
              <div className="flowTop">
                <span className="flowIcon" aria-hidden>🧠</span>
                <div>
                  <div className="flowTitle">Social_Link</div>
                  <div className="flowSub">Signals</div>
                </div>
              </div>
              <ul className="flowList">
                <li>Sentiment</li>
                <li>Trends / themes</li>
                <li>Roadmap social + news</li>
              </ul>
            </article>

            <div className="flowArrow" aria-hidden>→</div>

            <article className="flowCard">
              <div className="flowTop">
                <span className="flowIcon" aria-hidden>🤖</span>
                <div>
                  <div className="flowTitle">Nexus</div>
                  <div className="flowSub">AI + governance</div>
                </div>
              </div>
              <ul className="flowList">
                <li>RAG sobre docs</li>
                <li>MCP-ready</li>
                <li>Coordina, explica, enruta</li>
              </ul>
            </article>

            <div className="flowArrow" aria-hidden>→</div>

            <article className="flowCard">
              <div className="flowTop">
                <span className="flowIcon" aria-hidden>🧩</span>
                <div>
                  <div className="flowTitle">Integrations</div>
                  <div className="flowSub">Apps / Agents / Dashboards</div>
                </div>
              </div>
              <ul className="flowList">
                <li>SDKs</li>
                <li>Webhooks / cron</li>
                <li>Productos “platform-ready”</li>
              </ul>
          </article>
        </div>
      </section>

      {/* DEV EXPERIENCE */}
      <section className="section">
        <h2>Developer Experience</h2>
        <p className="section-intro">Menos fricción. Más shipping.</p>

        <div className="cards">
          <article className="card">
            <h3>Contracts</h3>
            <ul className="card-list">
              <li>✔ OpenAPI / Swagger (curado)</li>
              <li>✔ Endpoints estables</li>
              <li>✔ Docs públicas</li>
            </ul>
          </article>

          <article className="card">
            <h3>Security</h3>
            <ul className="card-list">
              <li>✔ API keys</li>
              <li>✔ Rate limiting por plan</li>
              <li>✔ Endpoints sensibles ocultos</li>
            </ul>
          </article>

          <article className="card">
            <h3>DX</h3>
            <ul className="card-list">
              <li>✔ SDK JS oficial</li>
              <li>✔ Quickstart copy/paste</li>
              <li>✔ Headers de observabilidad (X-Request-Id)</li>
            </ul>
          </article>
        </div>
      </section>

      {/* QUICKSTART */}
      <section id="quickstart" className="section">
        <h2>Quickstart</h2>
        <p className="section-intro">
          Prueba CryptoLink en 30 segundos. Docs completas en{" "}
          <a href="https://cryptolink.mx/docs" target="_blank" rel="noreferrer">
            cryptolink.mx/docs
          </a>
          .
        </p>

        <div className="card">
          <p style={{ marginTop: 0, opacity: 0.85 }}>
            <strong>REST</strong>
          </p>

          {/* ✅ Codebox pro */}
          <div className="codebox">
            <pre>
              <code>{`curl -s "https://cryptolink.mx/v1/prices?symbols=BTC,ETH&fiat=MXN" \\
  -H "x-api-key: TU_API_KEY"`}</code>
            </pre>
          </div>

          <p style={{ marginTop: 18, opacity: 0.85 }}>
            <strong>SDK (Node/TS)</strong>
          </p>

          {/* ✅ Codebox pro */}
          <div className="codebox">
            <pre>
              <code>{`npm i @evi_link/cryptolink

# luego:
# node test.mjs`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="section">
        <h2>Productos Destacados</h2>
        <p className="section-intro">
          Catálogo del ecosistema evi_link devs. Cada producto tiene su landing y sus docs (cuando aplique).
        </p>

        <div className="cards">
          {PRODUCTS.map((p) => (
            <article key={p.key} className={`card ${p.muted ? "card-muted" : ""}`}>
              <div className="card-top">
                <h3>{p.name}</h3>
                <span className={badgeClass(p.status)}>{p.status}</span>
              </div>

              <p>{p.desc}</p>

              <ul className="card-list">
                {p.bullets.map((b) => (
                  <li key={b}>✔ {b}</li>
                ))}
              </ul>

              {p.links?.length ? (
                <div className="card-actions">
                  {p.links.map((l) => {
                    const cls = "btn-mini";
                    return l.external ? (
                      <a key={l.href} href={l.href} className={cls} target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    ) : (
                      <a key={l.href} href={l.href} className={cls}>
                        {l.label}
                      </a>
                    );
                  })}
                </div>
              ) : null}

              {p.tag ? <p className="card-tag">{p.tag}</p> : null}
            </article>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="section section-soft">
        <div className="card-top">
          <h2>Roadmap</h2>
          <p className="section-intro">En construcción… (pero ya se siente el monstruo)</p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="card">
          <h2 className="card-title">Sobre</h2>
          <div className="card-top">
            <article className="card card-muted">
              <p>
                evi_link devs nace como un estudio independiente enfocado en backend y APIs listas para producción:
                performance, observabilidad y soporte como prioridades. Operando desde CDMX, con foco en proyectos que
                mezclan banca, automatización y cloud.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p>©️ {new Date().getFullYear()} evi_link devs. All rights reserved.</p>

          <div className="footer-contact">
            <span>Contacto:</span>
            <a href="mailto:support@evilink.dev">support@evilink.dev</a>
            <span className="dot"> • </span>
            <a href="mailto:billing@evilink.dev">billing@evilink.dev</a>
          </div>

          <p className="footer-note">
            Sitio y APIs en desarrollo activo. Este proyecto se construye en paralelo a otras responsabilidades
            profesionales, sin afiliación con terceros.
          </p>
        </div>
      </footer>
    </main>
  );
}