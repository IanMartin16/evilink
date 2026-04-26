// app/page.tsx
import Link from "next/link";

export default function Home() {
  type Status = "LIVE" | "PLATFORM" | "COMING SOON";

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
      name: "CryptoLink",
      status: "LIVE",
      desc: "La API de inteligencia cripto de Evilink, enfocada en precios, señales y experiencia de producto en evolución continua.",
      bullets: [
        "Actualmente en v2.8 y cerca de su versión objetivo",
        "Producto más maduro dentro del ecosistema",
        "Base técnica estable para su siguiente etapa",
      ],
      links: [
        { label: "Explore product →", href: "/products#cryptolink" },
        { label: "See roadmap →", href: "#roadmap" },
      ],
      tag: "v2.8 · cerca de versión meta",
      muted: false,
    },
    {
      key: "securelink",
      name: "Secure_Link",
      status: "PLATFORM",
      desc: "La línea de seguridad de Evilink, enfocada en señales de riesgo, protección y dirección estratégica para futuros módulos.",
      bullets: [
        "Risk Signals ya funciona como versión lite inicial",
        "Primera integración de ML con scikit-learn",
        "MVP en construcción para definir su dirección oficial",
      ],
      links: [
      //  { label: "View product →", href: "/products#securelink" },
        { label: "Roadmap →", href: "#roadmap" },
      ],
      tag: "Risk Signals · ML iniciado",
      muted: false,
    },
    {
      key: "nexus",
      name: "Nexus",
      status: "PLATFORM",
      desc: "La capa de integración de Evilink: acceso unificado, coordinación de productos y experiencia guiada sobre el ecosistema.",
      bullets: [
        "Knowledge-driven sobre docs y capacidades oficiales",
        "Evolucionando hacia su integración con MCP-One",
        "Orquesta, explica y enruta sin absorber lógica pesada",
      ],
      links: [
        { label: "Roadmap →", href: "#roadmap" },
      //  {
      //    label: "Join waitlist →",
      //    href: "mailto:support@evilink.dev?subject=Nexus%20waitlist",
      //    external: true,
      //  },
      ],
      tag: "Integrador oficial · evolución activa",
      muted: true,
    },
    {
      key: "datalink",
      name: "Data_Link",
      status: "PLATFORM",
      desc: "La línea de procesamiento de datos de Evilink, diseñada para manejar archivos pesados y evolucionar hacia flujos más potentes.",
      bullets: [
        "Soporta archivos de hasta 500 MB",
        "Usa MinIO como base para almacenamiento y procesamiento",
        "Incubación activa con enfoque en capacidad operativa real",
      ],
      links: [
      //  { label: "View product →", href: "/products#datalink" },
        { label: "See roadmap →", href: "#roadmap" },
      ],
      tag: "500 MB · incubación activa",
      muted: false,
    },
  ];

  const badgeClass = (s: Status) => {
    if (s === "LIVE") return "badge badge-live";
    if (s === "PLATFORM") return "badge badge-launch";
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
            APIs y productos modulares <br />
            para developers.
          </h1>

          <p>
            evi_link devs es un ecosistema developer-first: construimos productos y APIs listas para producción, con
            contratos claros, integración modular y seguridad desde el MVP.
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
          Una idea simple: <strong>data + signals + AI</strong>. Evilink conecta productos especializados en un ecosistema
          modular donde cada capa aporta valor real, desde datos y tendencias hasta integración guiada.
        </p>

        <div className="cards">
          <article className="card">
            <div className="card-top">
              <h3>CryptoLink</h3>
              <span className="badge badge-live">LIVE</span>
            </div>
            <p>La capa de market data del ecosistema: precios, streaming y experiencia de producto lista para escalar.</p>
            <ul className="card-list">
              <li>✔ Precios batch + streaming SSE</li>
              <li>✔ SDK JS oficial</li>
              <li>✔ Base madura rumbo a su siguiente gran versión</li>
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
              <span className="badge badge-dev">PLATFORM</span>
            </div>
            <p>La capa de trends y señales del ecosistema, diseñada para enriquecer productos con contexto en tiempo real.</p>
              <ul className="card-list">
                <li>✔ Trends activos con CoinGecko y Alternative.me</li>
                <li>✔ Integrado ya en CryptoLink</li>
                <li>✔ Evolución futura hacia señales más amplias</li>
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
            <p className="card-tag">Signals layer · integración activa</p>
          </article>

          <article className="card card-muted">
            <div className="card-top">
              <h3>Nexus</h3>
              <span className="badge badge-dev">PLATFORM</span>
            </div>
            <p>La capa de integración del ecosistema: acceso unificado, coordinación de productos y experiencia guiada.</p>
            <ul className="card-list">
              <li>✔ Knowledge-driven sobre docs oficiales</li>
              <li>✔ Evolucionando hacia su integración con MCP-One</li>
              <li>✔ Orquesta sin absorber lógica pesada</li>
            </ul>
          
          <p className="card-tag">Integrador oficial · evolución activa</p>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <h2>Cómo funciona</h2>
        <p className="section-intro">
          Para el usuario final se siente simple. Para developers, Evilink funciona como un pipeline claro de datos,
          señales e integración.
        </p>

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
              <li>Base sólida en evolución continua</li>
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
              <li>Trends activos</li>
              <li>CoinGecko + Alternative.me</li>
              <li>Integrado ya en CryptoLink</li>
            </ul>
          </article>

          <div className="flowArrow" aria-hidden>→</div>

          <article className="flowCard">
            <div className="flowTop">
              <span className="flowIcon" aria-hidden>🤖</span>
              <div>
                <div className="flowTitle">Nexus</div>
                <div className="flowSub">Integration layer</div>
              </div>
            </div>
            <ul className="flowList">
              <li>Knowledge-driven sobre docs</li>
              <li>Evolución hacia MCP-One</li>
              <li>Coordina, explica y enruta</li>
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
              <li>SDKs y clientes</li>
              <li>Workflows y automatización</li>
              <li>Productos platform-ready</li>
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
      <section id="roadmap" className="section">
        <h2>Roadmap</h2>

      {/* Mantra */}
      <p className="section-intro" style={{ marginTop: 6 }}>
        <strong>Optimizar primero.</strong> Escalar después. Contratos claros siempre.
      </p>
 
      <div className="cards">
        {/* NOW */}
        <article className="card">
          <div className="card-top">
            <h3>Now (Q2 2026)</h3>
            <span className="badge badge-live">FOCUS</span>
          </div>

          <p>Lo que hoy está consolidando el core del ecosistema.</p>

          <ul className="card-list">
            <li>✔ CryptoLink en v2.8, cerca de su versión objetivo</li>
            <li>✔ Nexus evolucionando hacia su integración con MCP-One</li>
            <li>✔ Social_Link ya entrega trends con CoinGecko y Alternative.me</li>
            <li>✔ Data_Link soporta archivos de hasta 500 MB con MinIO</li>
            <li>✔ Secure_Link avanza con Risk Signals y su primer paso en ML</li>
          </ul>

          <p className="card-tag">Core ecosystem · integración real · consolidación técnica</p>
        </article>

        {/* NEXT */}
        <article className="card">
          <div className="card-top">
            <h3>Next (Q2–Q3 2026)</h3>
            <span className="badge badge-next">NEXT</span>
          </div>

          <p>Lo siguiente: fortalecer la integración y empujar la próxima expansión clave.</p>

          <ul className="card-list">
            <li>✔ Acelerar Validate Suite como evolución de Curpify</li>
            <li>✔ Definir con más claridad el MVP oficial de Secure_Link</li>
            <li>✔ Seguir fortaleciendo Nexus como capa de acceso e integración</li>
            <li>✔ Consolidar el flujo CryptoLink + Social_Link + Nexus</li>
          </ul>

          <div className="card-actions">
            <a className="btn-mini" href="/products/cryptolink">CryptoLink →</a>
            <a className="btn-mini" href="#ecosystem">Ecosystem →</a>
          </div>

          <p className="card-tag">Expansión comercial · integration layer · platform growth</p>
        </article>

        {/* SOON */}
          <article className="card card-muted">
            <div className="card-top">
              <h3>Soon (Q3 2026)</h3>
              <span className="badge badge-soon">SOON</span>
            </div>

            <p>Lo que sigue una vez estabilizado el núcleo principal del ecosistema.</p>

            <ul className="card-list">
              <li>✔ Vision_Link permanece pausado con una v1 ya existente en YOLOv11</li>
              <li>✔ Lite experiments seguirán como validación controlada de mercado</li>
              <li>✔ Nuevas líneas del ecosistema siguen en radar sin prioridad inmediata</li>
            </ul>

            <p className="card-tag">Incubación ordenada · exploración sin distraer el core</p>
          </article>

          {/* STRATEGIC LINE */}
          <article className="card card-muted">
            <div className="card-top">
              <h3>Strategic line</h3>
              <span className="badge badge-inc">IN PROGRESS</span>
            </div>

            <p>
              Secure_Link evoluciona como la capa estratégica de seguridad del ecosistema, enfocada en señales de riesgo,
              protección y dirección futura.
            </p>

            <ul className="card-list">
              <li>✔ Risk Signals ya existe como versión lite inicial</li>
              <li>✔ Primer integración de machine learning con scikit-learn</li>
              <li>✔ Base para futuros módulos de seguridad y confianza</li>
            </ul>

            <p className="card-tag">Security · trust · strategic direction</p>
          </article>
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