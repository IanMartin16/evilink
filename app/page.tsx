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
    desc: "CryptoLink completó un hito importante de hardening, reorganización y enriquecimiento de datos, consolidándose como una experiencia de mercado más clara, eficiente y confiable.",
    bullets: [
      "Reducción significativa de llamadas redundantes al proveedor",
      "Market360º, Top Movers y Derived Intelligence reorganizan mejor el valor del portal",
      "Datos ricos y señales visibles sin romper contratos existentes",
    ],
    tag: "hardening · v4 · derived intelligence",
    muted: false,
  },
  {
    key: "social_link",
    name: "Social_Link",
    status: "PLATFORM",
    desc: "Social_Link dejó de ser una pieza secundaria y ahora aporta datos reales que enriquecen la experiencia de CryptoLink.",
    bullets: [
      "Alimenta secciones clave como Market360º, Market Attention y Trending Now",
      "Aporta contexto de mercado sin cargar más al motor principal de CryptoLink",
      "Se consolida como capa real de señales dentro del ecosistema",
    ],
    tag: "signals API · real market context",
    muted: false,
  },
  {
    key: "nexus_mcpone",
    name: "Nexus + MCP-One",
    status: "PLATFORM",
    desc: "La capa de integración del ecosistema dio un paso clave al sacar a Nexus Core del camino crítico y operar sobre una ruta más ligera con Nexus-slim, evi-gateway y MCP-One.",
    bullets: [
      "Nexus-slim reemplaza la ruta pesada de Nexus Core en producción",
      "MCP-One ya participa en la integración operativa del ecosistema",
      "La nueva ruta reduce carga y libera capacidad para la siguiente etapa",
    ],
    tag: "lightweight core · production integration",
    muted: false,
  },
  {
    key: "statushub",
    name: "Status-Hub",
    status: "LIVE",
    desc: "Status-Hub continúa evolucionando como capa operativa del ecosistema, ahora con health endpoints más estandarizados y señales más útiles.",
    bullets: [
      "Servicios productivos hablan un lenguaje health más consistente",
      "Mejor separación entre liveness, readiness y performance",
      "Base más sólida para la evolución futura hacia IO",
    ],
    tag: "observability · health standard · IO path",
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
            ✦ Este ciclo estuvo enfocado en consolidación: menos ruido operativo, más datos útiles,
            mejor observabilidad y una capa de integración más ligera para sostener la siguiente etapa del ecosistema.
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
            <h3>Now</h3>
            <span className="badge badge-live">FOCUS</span>
          </div>

          <p>
            Después de un ciclo fuerte de hardening y reorganización, la siguiente etapa se enfoca
            en consolidar productos existentes, observar estabilidad real y preparar piezas más robustas
            antes de cualquier expansión.
          </p>

          <ul className="card-list">
            <li>✔ Finalizar la observación de CryptoLink tras su hardening y evolución de API</li>
            <li>✔ Revisar Data_Link Transform como siguiente línea fuerte de datos</li>
            <li>✔ Continuar la evolución de Status-Hub hacia una capa IO más inteligente</li>
            <li>✔ Observar la ruta Nexus-slim → evi-gateway → MCP-One en producción</li>
            <li>✔ Definir el futuro técnico y comercial de Curpify tras su etapa de análisis</li>
          </ul>

          <p className="card-tag">Hardening · consolidation · no new fronts</p>
        </article>

        {/* NEXT */}
        <article className="card">
          <div className="card-top">
            <h3>Next</h3>
            <span className="badge badge-next">NEXT</span>
          </div>

          <p>
           Productos con avance importante que serán evaluados con más calma antes de pasar
            a una etapa pública más fuerte.
          </p>

          <ul className="card-list">
            <li>✔ Secure_Link se perfila como candidato serio para una futura etapa de soft launch</li>
            <li>✔ Data_Link Transform será revisado para definir alcance, utilidad y madurez</li>
            <li>✔ Behavioral Shield entra como candidato avanzado dentro de la línea de seguridad</li>
            <li>✔ Nexus y MCP-One seguirán fortaleciendo la capa de integración del ecosistema</li>
          </ul>

          <p className="card-tag">Security · data transform · integration core</p>
        </article>

        {/* SOON */}
          <article className="card card-muted">
            <div className="card-top">
              <h3>Soon (Q4 2026)</h3>
              <span className="badge badge-soon">SOON</span>
            </div>

            <p>
            Líneas con base técnica o dirección inicial que se retomarán con más foco una vez
             estabilizados los candidatos principales y el núcleo de integración.
            </p>

            <ul className="card-list">
              <li>✔ SignVerify aparece como candidato avanzado para una siguiente etapa de verificación</li>
              <li>✔ Email Deliverability será replanteado con nuevo enfoque y nombre por confirmar</li>
              <li>✔ Vision_Link continuará en incubación mientras se define su dirección final</li>
            </ul>

            <p className="card-tag">Verification · deliverability · incubation</p>
          </article>

          {/* STRATEGIC LINE */}
            <article className="card card-muted">
              <div className="card-top">
                <h3>Strategic line</h3>
                <span className="badge badge-inc">INTERNAL</span>
              </div>

              <p>
                EviForge y las capacidades internas del ecosistema seguirán evolucionando como soporte
                para acelerar entregas, reducir fricción técnica y evitar que una sola pieza concentre
                demasiadas responsabilidades.
              </p>

              <ul className="card-list">
                <li>✔ EviForge ya ha entregado resultados en productos reales como evi-gateway y V-Secrets</li>
                <li>✔ La estrategia favorece piezas ligeras, satélite y bien delimitadas</li>
                <li>✔ Su evolución futura se alinea con tooling interno, SDKs y soporte al ecosistema</li>
              </ul>

              <p className="card-tag">Internal tooling · satellite capabilities · ecosystem acceleration</p>
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