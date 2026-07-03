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
    key: "cryptolink",
    name: "CryptoLink",
    status: "LIVE",
    desc: "La API de inteligencia cripto de Evilink ahora evoluciona a v4 y empieza a consolidarse como un portal de referencia con datos reales, contexto enriquecido y una experiencia de mercado mucho más madura.",
    bullets: [
      "Versión 4 ya operando como nueva etapa del producto",
      "Market360º sustituye la vista anterior y mejora la lectura del mercado",
      "Combina datos derivados de CryptoLink con contexto real provisto por Social_Link",
    ],
    links: [
      { label: "Explore product →", href: "/products#cryptolink" },
      { label: "Browse the site →", href: "https://cryptolink.mx" },
    ],
    tag: "v4 · enriched market portal",
    muted: false,
  },
  {
    key: "social_link",
    name: "Social_Link",
    status: "PLATFORM",
    desc: "La capa de trends y señales del ecosistema ya opera como una API confiable que aporta contexto real de mercado dentro de CryptoLink.",
    bullets: [
      "Ya no funciona como placeholder: entrega datos valiosos de mercado",
      "Alimenta cerca del 50% del contexto visible en el portal de CryptoLink",
      "Enriquece la lectura del mercado junto con derivados propios de CryptoLink",
    ],
    links: [
      { label: "See roadmap →", href: "#roadmap" },
    ],
    tag: "signals API · real market context",
    muted: false,
  },
  {
    key: "datalink",
    name: "Data_Link",
    status: "PLATFORM",
    desc: "La línea de procesamiento de datos de Evilink mantiene su fortaleza técnica como uno de los motores más prometedores del ecosistema.",
    bullets: [
      "Resultados sólidos en pruebas con datasets de alto volumen",
      "Motor optimizado con multiprocessing y chunk sizing",
      "Sigue consolidándose como una pieza de alto potencial dentro del mapa de productos",
    ],
    links: [
      { label: "Open console →", href: "data-link" },
    ],
    tag: "high-volume engine · strong core",
    muted: false,
  },
  {
    key: "statushub",
    name: "Status-Hub",
    status: "LIVE",
    desc: "La capa operativa de monitoreo de Evilink continúa consolidándose como soporte real del ecosistema, no solo por sus métricas y checks, sino por su capacidad de detectar problemas antes de que escalen.",
    bullets: [
      "Ya reveló y previno bugs y debilidades de seguridad a tiempo",
      "Checks reales y métricas operativas ya integradas en el portal",
      "Su evolución futura como capa de observabilidad se vuelve cada vez más natural",
    ],
    links: [
      { label: "See status →", href: "status" },
    ],
    tag: "monitoring · prevention · live ops",
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
            APIs, productos e integración modular <br />
            para developers.
          </h1>

          <p>
            evi_link devs es un ecosistema developer-first: construimos APIs,
            productos y capas de integración listas para producción, con contratos
            claros, arquitectura modular, señales reales y operación observable desde
            etapas tempranas.
          </p>

          <div className="pills">
            <span className="pill"><b>Core:</b> CryptoLink v4</span>
            <span className="pill"><b>Signals:</b> Social_Link</span>
            <span className="pill"><b>Ops:</b> Status-Hub</span>
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
            ✦ Últimos avances: el ecosistema entra en una etapa de consolidación técnica,
            con <strong>CryptoLink v4</strong>, señales reales desde <strong>Social_Link</strong>
            y operación más visible mediante <strong>Status-Hub</strong>.
          </p>
        </div>

        <div className="hero-card">
          <h2>Arquitectura base</h2>
          <ul>
            <li>Next.js para UI, portales y capas ligeras de integración</li>
            <li>Servicios core en Spring Boot, Python o Rust según el caso de uso</li>
            <li>OpenAPI, Auth, rate limiting, observabilidad y hardening progresivo</li>
          </ul>

          <p className="hero-card-foot">
            Optimizar primero, escalar después: productos más sólidos antes de crecer.
          </p>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section id="ecosystem" className="section">
        <h2>Ecosystem</h2>
        <p className="section-intro">
          Una idea simple: <strong>productos especializados + signals + integración</strong>. Evilink conecta capas
          complementarias en un ecosistema modular donde cada servicio aporta valor real, desde datos y contexto
          hasta coordinación guiada, monitoreo operativo y evolución continua.
        </p>

        <div className="cards">
          <article className="card">
            <div className="card-top">
              <h3>CryptoLink</h3>
              <span className="badge badge-live">LIVE</span>
            </div>
            <p>La capa de market data del ecosistema: precios, streaming y experiencia de producto ya consolidada en v4.</p>
            <ul className="card-list">
              <li>✔ Precios batch + streaming SSE</li>
              <li>✔ SDK JS oficial</li>
              <li>✔ Base madura y portal de referencia en evolución continua</li>
            </ul>
            <div className="card-actions">
              <a className="btn-mini" href="/products/cryptolink">
                Comprar →
              </a>
              <a className="btn-mini" href="https://cryptolink.mx/docs" target="_blank" rel="noreferrer">
                Docs →
              </a>
            </div>
            <p className="card-tag">v4 · market data · product layer</p>
          </article>

          <article className="card card-muted">
            <div className="card-top">
              <h3>Social_Link</h3>
              <span className="badge badge-launch">PLATFORM</span>
            </div>
            <p>La capa de trends y señales del ecosistema, ya integrada con datos reales que enriquecen el contexto de mercado dentro de CryptoLink.</p>
              <ul className="card-list">
                <li>✔ Trends activos con CoinGecko y Alternative.me</li>
                <li>✔ Integrado ya en CryptoLink</li>
                <li>✔ API confiable con valor real de mercado</li>
              </ul>
            <p className="card-tag">Signals layer · real market context</p>
          </article>

          <article className="card card-muted">
            <div className="card-top">
              <h3>MCP-One</h3>
              <span className="badge badge-launch">PLATFORM</span>
            </div>
            <p>La capa de orquestación e inteligencia del ecosistema, ya integrada con Nexus en producción como parte del núcleo de coordinación real de Evilink.</p>
            <ul className="card-list">
              <li>✔ Integración real con Nexus ya operando en prod</li>
              <li>✔ Orquesta y estructura la siguiente capa del ecosistema</li>
              <li>✔ Se consolida como una de las piezas más estratégicas del hub</li>
            </ul>
            <p className="card-tag">Orchestration layer · production integration</p>
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
              <li>✔ Base lista para alertas, métricas y evolución futura</li>
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
          <strong> datos, señales, orquestación y operación observable</strong>.
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
              <li>Market360º</li>
              <li>Portal enriquecido en v4</li>
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
              <li>Datos reales de mercado</li>
              <li>Contexto integrado en CryptoLink</li>
            </ul>
          </article>

          <div className="flowArrow" aria-hidden>→</div>

            <article className="flowCard">
              <div className="flowTop">
                <span className="flowIcon" aria-hidden>🤖</span>
                <div>
                  <div className="flowTitle">MCP-One + Nexus</div>
                  <div className="flowSub">Orchestration layer</div>
                </div>
              </div>

              <ul className="flowList">
                <li>MCP-One integrado con Nexus en prod</li>
                <li>Coordinación guiada del ecosistema</li>
                <li>Base para integración más avanzada</li>
              </ul>
            </article>

            <div className="flowArrow" aria-hidden>→</div>

            <article className="flowCard">
              <div className="flowTop">
                <span className="flowIcon" aria-hidden>🛡️</span>
                <div>
                  <div className="flowTitle">Status-Hub</div>
                  <div className="flowSub">Operations</div>
                </div>
              </div>

              <ul className="flowList">
                <li>Checks reales</li>
                <li>Visibilidad operativa</li>
                <li>Detección temprana de bugs y debilidades</li>
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

            <p>Lo que hoy está consolidando el núcleo real del ecosistema.</p>

            <ul className="card-list">
              <li>✔ CryptoLink alcanzó su v4 y fortalece su rol como portal de referencia</li>
              <li>✔ Social_Link ya entrega contexto real de mercado dentro de CryptoLink</li>
              <li>✔ MCP-One ya opera integrado con Nexus en producción</li>
              <li>✔ Data_Link continúa consolidándose como motor de alto potencial</li>
              <li>✔ Status-Hub ya vive como capa operativa y preventiva del ecosistema</li>
            </ul>

            <p className="card-tag">Core ecosystem · integración real · consolidación técnica</p>
          </article>

          {/* NEXT */}
          <article className="card">
            <div className="card-top">
              <h3>Next (Q3 2026)</h3>
              <span className="badge badge-next">NEXT</span>
            </div>

            <p>Lo siguiente: fortalecer la capa de integración, endurecer productos clave y preparar el siguiente ciclo de evolución.</p>

            <ul className="card-list">
              <li>✔ evi-gateway avanzará como pieza de integración conectada a MCP-One</li>
              <li>✔ Secure_Link se prepara como siguiente foco estratégico del ecosistema</li>
              <li>✔ Data_Link Transform será evaluado como evolución avanzada de la línea de datos</li>
              <li>✔ Nexus y MCP-One seguirán consolidando la capa de acceso y orquestación del hub</li>
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

            <p>
              Líneas que ya tienen avances o dirección inicial, pero que se retomarán con más foco
              una vez estabilizado el núcleo de integración.
            </p>

            <ul className="card-list">
              <li>✔ Vision_Link ya cuenta con alertas integradas, pero su modelo aún requiere pruebas más profundas</li>
              <li>✔ SignVerify aparece como candidato avanzado para Q4</li>
              <li>✔ Email deliverability será retomado con nuevo enfoque y nombre por confirmar</li>
            </ul>

            <p className="card-tag">Verification · vision alerts · deliverability</p>
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
                <li>✔ Reduce fricción de arranque y fortalece la capacidad interna de construcción</li>
                <li>✔ Su evolución futura se alinea más con tooling interno y SDKs que con una línea pública propia</li>
              </ul>

              <p className="card-tag">Internal tooling · build capacity · ecosystem acceleration</p>
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