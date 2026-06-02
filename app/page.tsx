// app/page.tsx
import Link from "next/link";

export default function Home() {
  type Status = "LIVE" | "PLATFORM" | "COMING SOON" | "SOFT LAUNCH";

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
    key: "curpify",
    name: "Curpify",
    status: "LIVE",
    desc: "Validación de CURP y RFC para flujos de RH, onboarding y sistemas internos. Usa una API simple o valida directamente desde el dashboard",
    bullets: [
      "Ahora valida CURP y RFC con normalización y dígito verificador",
      "Dashboard para usuarios no técnicos",
      "API key usage tracking, IO-ready",
      "Upgrade visual antes de su fase de observación en soft launch"
    ],
    links: [
      { label: "Explore site →", href: "https://curpify.com" },
    ],
    tag: "live · strict validation upgrade",
    muted: false,
  },
  {
    key: "datalink",
    name: "Data_Link",
    status: "SOFT LAUNCH",
    desc: "La línea de procesamiento de datos de Evilink se perfila como una de las candidatas más fuertes del soft launch gracias a la potencia de su motor y la eficiencia de su rendimiento.",
    bullets: [
      "Resultados sólidos con datasets 1M CSV registros procesados en ~36s",
      "Optimización real con multiprocessing y chunk sizing",
      "Nuevo preset para deduplicar cualquier campo fuera de los presets originales",
    ],
    links: [
      { label: "Open console →", href: "data-link" },
    ],
    tag: "high-volume engine · soft launch candidate",
    muted: false,
  },
  {
    key: "vsecrets",
    name: "V-Secrets",
    status: "SOFT LAUNCH",
    desc: "Guarda API keys, tokens y credenciales técnicas cifradas. Permite que tus aplicaciones las recuperen en runtime mediante keys revocables y con permisos limitados.",
    bullets: [
      "Secrets cifrados",
      "Runtime keys con scopes",
      "Audit logs",
      "Integración API-first",
    ],
    links: [
      { label: "See Site →", href: "https://vsecrets.dev" },
    ],
    tag: "secure access · real-time key control",
    muted: false,
  },
  {
    key: "statushub",
    name: "Status-Hub",
    status: "LIVE",
    desc: " Capa de inteligencia operativa del ecosistema Evilink: monitorea salud readiness, latencia e historial real de eventos para servicios en producción.",
    bullets: [
      "Monitoreo automatizado de servicios clave",
      "Historial real de checks y eventos recientes",
      "Expone los ultimos 30 checks con metricas reales",
      "Base lista para integración futura con SSC dentro del modulo IO",
    ],
    links: [
      { label: "See Status →", href: "status" },
    ],
    tag: "monitoring · IO layer · live checks",
    muted: false,
  },
];

  const badgeClass = (s: Status) => {
    if (s === "LIVE") return "badge badge-live";
    if (s === "PLATFORM") return "badge badge-launch";
    if (s === "SOFT LAUNCH") return "badge badge-soft";
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
          <a href="/status">Status</a>
          <Link href="#about">Sobre</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Productos, APIs e integración modular <br />
            para developers.
          </h1>

          <p>
            evi_link devs es un ecosistema developer-first: construimos APIs, productos y capas de integración listas para producción, con contratos claros, arquitectura modular y seguridad desde el MVP.
          </p>

          <div className="pills">
            <span className="pill">
              <b>Soft launch:</b> 3 apps
            </span>
            <span className="pill">
              <b>Core:</b> Nexus + MCP-One
            </span>
            <span className="pill">
              <b>Ops:</b> Status-Hub v1
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
            ✦ Últimos avances: <strong>Curpify</strong>, <strong>Data_Link</strong> y <strong>V-Secrets</strong> entran en observación de soft launch mientras el ecosistema sigue consolidando su capa de integración y operación.
          </p>
        </div>

        <div className="hero-card">
          <h2>Arquitectura base</h2>
          <ul>
            <li>Next.js para UI, portales y capas ligeras de integración</li>
            <li>Servicios core en Spring Boot, Python o Rust según el caso de uso</li>
            <li>Bases cloud-ready con OpenAPI, Auth, rate limiting y observabilidad mínima</li>
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
          Una idea simple: <strong>productos especializados + signals + integración</strong>. Evilink conecta capas
          complementarias en un ecosistema modular donde cada servicio aporta valor real, desde datos y contexto
          hasta coordinación guiada y visibilidad operativa.
        </p>

      <div className="cards">
        <article className="card">
          <div className="card-top">
            <h3>CryptoLink</h3>
            <span className="badge badge-live">LIVE</span>
          </div>
        <p>La capa de market data del ecosistema: precios, streaming y experiencia de producto ya consolidada en v3.</p>
            <ul className="card-list">
              <li>✔ Precios batch + streaming SSE</li>
              <li>✔ SDK JS oficial</li>
              <li>✔ Base madura lista para su siguiente evolución</li>
            </ul>
          <div className="card-actions">
            <a className="btn-mini" href="/products/cryptolink">
              Comprar →
            </a>
            <a className="btn-mini" href="https://cryptolink.mx/docs" target="_blank" rel="noreferrer">
              Docs →
            </a>
          </div>
        <p className="card-tag">v3 · Spring Boot · Railway · Stripe</p>
        </article>

        <article className="card card-muted">
          <div className="card-top">
            <h3>Social_Link</h3>
              <span className="badge badge-launch">PLATFORM</span>
          </div>
            <p>La capa de trends y señales del ecosistema, ya integrada en productos reales para enriquecer contexto en tiempo real.</p>
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
              <span className="badge badge-launch">PLATFORM</span>
              </div>
              <p>La capa de integración del ecosistema: acceso unificado, coordinación de productos y experiencia guiada.</p>
                <ul className="card-list">
                  <li>✔ Knowledge-driven sobre docs oficiales</li>
                  <li>✔ Evolucionando hacia su integración con MCP-One</li>
                  <li>✔ Orquesta sin absorber lógica pesada</li>
                </ul>
              <p className="card-tag">Integrador oficial · evolución activa</p>
        </article>

        <article className="card card-muted">
          <div className="card-top">
            <h3>Status-Hub</h3>
            <span className="badge badge-live">LIVE</span>
          </div>

          <p>
            Capa de inteligencia operativa del ecosistema Evilink: monitorea salud,
            readiness, latencia e historial real de eventos para servicios clave.
          </p>

          <ul className="card-list">
            <li>✔ Checks reales con historial reciente por servicio</li>
            <li>✔ Detección de degradación, caídas y platform issues</li>
            <li>✔ Base lista para alertas, métricas y Agentic Memory</li>
          </ul>

          <div className="card-actions">
            <a className="btn-mini" href="/status">
              Ver →
            </a>
          </div>

          <p className="card-tag">
            Observability · Readiness · Service Events
          </p>
        </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <h2>Cómo funciona</h2>
        <p className="section-intro">
           Para el usuario final se siente simple. Para developers, Evilink funciona como un pipeline claro de
           <strong> datos, señales, integración y consumo operativo</strong>.
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
                <li>Base consolidada en v3</li>
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
                <li>Evolución activa junto a MCP-One</li>
                <li>Coordina, explica y enruta</li>
              </ul>
          </article>

          <div className="flowArrow" aria-hidden>→</div>

            <article className="flowCard">
              <div className="flowTop">
              <span className="flowIcon" aria-hidden>🧩</span>
                <div>
                <div className="flowTitle">Apps & Operations</div>
                <div className="flowSub">Dashboards / workflows / monitoring</div>
              </div>
              </div>
              <ul className="flowList">
                <li>SDKs, clientes y automatización</li>
                <li>Productos platform-ready</li>
                <li>Visibilidad operativa con Status-Hub</li>
              </ul>
            </article>
          </div>
        </section>

      {/* DEV EXPERIENCE */}
      <section className="section">
        <h2>Developer Experience</h2>
        <p className="section-intro">Menos fricción. Más consistencia. Más shipping.</p>

        <div className="cards">
          <article className="card">
            <h3>Contracts</h3>
            <ul className="card-list">
              <li>✔ OpenAPI / Swagger curado</li>
              <li>✔ Endpoints estables y contratos claros</li>
              <li>✔ Docs públicas donde el producto ya lo requiere</li>
            </ul>
          </article>

          <article className="card">
            <h3>Security</h3>
            <ul className="card-list">
              <li>✔ API keys y control de acceso por producto</li>
              <li>✔ Rate limiting por plan o caso de uso</li>
              <li>✔ Endpoints sensibles fuera de la superficie pública</li>
            </ul>
          </article>

          <article className="card">
            <h3>Delivery</h3>
            <ul className="card-list">
              <li>✔ Bases reutilizables y arranques cloud-ready</li>
              <li>✔ Integración consistente entre servicios y productos</li>
              <li>✔ Tooling interno para acelerar entregas sin perder control técnico</li>
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

            <p>Lo que hoy está consolidando el soft launch y la siguiente capa estratégica del ecosistema.</p>

            <ul className="card-list">
              <li>✔ Curpify, Data_Link y V-Secrets entran en fase de soft launch / observación</li>
              <li>✔ Nexus sigue como prioridad principal junto a MCP-One</li>
              <li>✔ evi-gateway entra como foco inmediato con integración hacia Nexus y MCP-One</li>
              <li>✔ Status-Hub ya opera como capa de monitoreo real dentro del portal</li>
              <li>✔ CryptoLink v3 queda consolidado como producto maduro del ecosistema</li>
            </ul>

            <p className="card-tag">Soft launch · integration focus · core maturity</p>
          </article>

          {/* NEXT */}
            <article className="card">
              <div className="card-top">
                <h3>Next (Q3 2026)</h3>
                <span className="badge badge-next">NEXT</span>
              </div>

              <p>Lo siguiente: fortalecer la capa de integración, validar nuevos candidatos y preparar el siguiente ciclo de productos.</p>

              <ul className="card-list">
                <li>✔ Secure_Link será evaluado como candidato fuerte para launch en julio / agosto</li>
                <li>✔ Data_Link Transform será analizado a fondo como producto avanzado</li>
                <li>✔ Vision_Link podría tomar un nuevo rumbo más enfocado en facial recognition</li>
                <li>✔ evi-gateway avanzará como pieza 100% Rust conectada al núcleo MCP-One + Nexus</li>
              </ul>

              <div className="card-actions">
                <a className="btn-mini" href="#ecosystem">Ecosystem →</a>
                <a className="btn-mini" href="#products">Products →</a>
              </div>

              <p className="card-tag">Gateway · security · advanced data flows</p>
            </article>

            {/* SOON */}
            <article className="card card-muted">
              <div className="card-top">
                <h3>Soon (Q4 2026)</h3>
                <span className="badge badge-soon">SOON</span>
              </div>

              <p>Lo que sigue una vez estabilizado el nuevo núcleo de integración y definidos los lanzamientos del siguiente ciclo.</p>

              <ul className="card-list">
                <li>✔ SignVerify aparece como candidato avanzado para Q4</li>
                <li>✔ Email deliverability revivirá con nuevas capacidades y mejor dirección</li>
                <li>✔ Vision_Link podría madurar hacia una línea más clara de reconocimiento facial</li>
              </ul>

              <p className="card-tag">Verification · deliverability · computer vision</p>
            </article>

            {/* STRATEGIC LINE */}
            <article className="card card-muted">
              <div className="card-top">
                <h3>Strategic line</h3>
                <span className="badge badge-inc">INTERNAL</span>
              </div>

              <p>
                EviForge evoluciona como capacidad interna del ecosistema, acelerando bases cloud-ready y entregando soporte real a productos estratégicos sin convertirse en una oferta comercial pública.
              </p>

              <ul className="card-list">
                <li>✔ Ya ha entregado resultados en productos reales como evi-gateway y V-Secrets</li>
                <li>✔ Fortalece la velocidad de construcción sin sacrificar criterio técnico</li>
                <li>✔ Su evolución futura se alinea más con tooling interno y SDKs que con una línea pública propia</li>
              </ul>

              <p className="card-tag">Internal tooling · cloud-ready delivery · ecosystem acceleration</p>
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