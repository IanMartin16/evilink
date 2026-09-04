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
    key: "vsecrets",
    name: "V-Secrets",
    status: "PLATFORM",
    desc: "V-Secrets dio un salto importante hacia una experiencia más profesional, con una landing más clara, acceso moderno y capacidades clave ya probadas en producción.",
    bullets: [
      "Website renovado con landing informativa antes del acceso",
      "Checkout live y planes de suscripción ya disponibles",
      "Rotate key implementado y probado en producción",
    ],
    links: [
      { label: "Visit website →", href: "https://vsecrets.dev", external: true },
      { label: "See roadmap →", href: "#roadmap" },
    ],
    tag: "secure access · live checkout · key rotation",
    muted: false,
  },
  {
    key: "data_link",
    name: "Data_Link",
    status: "PLATFORM",
    desc: "Data_Link avanza hacia una etapa más sólida con dominio propio, nueva consola y una dirección más clara para unir procesamiento y transformación de datos.",
    bullets: [
      "Nuevo dominio data-link.dev como base del producto",
      "Nueva consola casi concluida para alojar Core y Transform",
      "Checkout live integrado para suscripciones reales",
    ],
    links: [
      { label: "Visit website →", href: "https://data-link.dev", external: true },
      { label: "See roadmap →", href: "#roadmap" },
    ],
    tag: "data-link.dev · console · transform path",
    muted: false,
  },
  {
    key: "market_intelligence",
    name: "CryptoLink + Social_Link",
    status: "LIVE",
    desc: "CryptoLink y Social_Link consolidan una capa de inteligencia de mercado más rica, combinando datos reales, señales sociales y derivados propios del ecosistema.",
    bullets: [
      "CryptoLink web evoluciona como portal de referencia pública",
      "CryptoLink V2 fortalece su contrato, sus llamadas por símbolos y sus derivados",
      "Social_Link avanza hacia una capa de insights basada en datos persistentes",
    ],
    links: [
      { label: "Visit CryptoLink →", href: "https://cryptolink.mx/dashboard", external: true },
      { label: "Docs →", href: "https://cryptolink.mx/docs", external: true },
    ],
    tag: "market intelligence · real signals · enriched API",
    muted: false,
  },
  {
    key: "statushub",
    name: "Status-Hub",
    status: "LIVE",
    desc: "Status-Hub fortalece su papel como capa de observabilidad del ecosistema, ahora con métricas reales, datos más ricos y una consola más útil.",
    bullets: [
      "Upgrade de base de datos para construir métricas reales",
      "Consola enriquecida con más visibilidad operativa",
      "Camino más claro hacia una capa IO más inteligente",
    ],
    links: [
      { label: "View status →", href: "/status" },
      { label: "See roadmap →", href: "#roadmap" },
    ],
    tag: "observability · metrics · IO path",
    muted: false,
  },
]

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
            ✦ Este ciclo estuvo enfocado en consolidación: productos más maduros,
            más datos útiles, mejor observabilidad y una capa de mercado más rica
            para sostener la siguiente etapa del ecosistema.
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
          Una idea simple: <strong>productos especializados + datos + señales + operación</strong>.
          Evilink conecta capas complementarias en un ecosistema modular donde cada servicio aporta
          valor real, desde inteligencia de mercado y procesamiento de datos hasta acceso seguro,
          monitoreo operativo y evolución continua.
        </p>

        <div className="cards">
          <article className="card">
            <div className="card-top">
              <h3>Market Intelligence</h3>
              <span className="badge badge-live">LIVE</span>
            </div>

            <p>
              CryptoLink y Social_Link consolidan una capa de inteligencia de mercado con datos reales,
              señales visibles y una experiencia pública más rica.
            </p>

            <ul className="card-list">
              <li>✔ CryptoLink web evoluciona como portal de referencia pública</li>
              <li>✔ Market360º, Trending Now y derivados fortalecen la lectura del mercado</li>
              <li>✔ Social_Link aporta señales reales y avanza hacia una capa de insights</li>
            </ul>

            <div className="card-actions">
              <a className="btn-mini" href="/products/cryptolink">
                Comprar →
              </a>
              <a className="btn-mini" href="https://cryptolink.mx/docs" target="_blank" rel="noreferrer">
                Docs →
              </a>
            </div>

            <p className="card-tag">CryptoLink · Social_Link · market signals</p>
          </article>

          <article className="card card-muted">
            <div className="card-top">
              <h3>Secure Access</h3>
              <span className="badge badge-launch">PLATFORM</span>
            </div>

            <p>
              V-Secrets fortalece la capa de acceso seguro del ecosistema con una experiencia más clara,
              suscripciones activas y control de llaves en producción.
            </p>

            <ul className="card-list">
              <li>✔ Landing informativa antes del acceso</li>
              <li>✔ Checkout live y planes de suscripción disponibles</li>
              <li>✔ Rotate key probado en producción con enfoque developer-first</li>
            </ul>

            <p className="card-tag">V-Secrets · key control · secure access</p>
          </article>

          <article className="card card-muted">
            <div className="card-top">
              <h3>Data Layer</h3>
              <span className="badge badge-launch">PLATFORM</span>
            </div>

            <p>
              Data_Link avanza como capa de procesamiento y transformación de datos, con dominio propio,
              nueva consola y una dirección más clara para Core y Transform.
            </p>

            <ul className="card-list">
              <li>✔ data-link.dev como nueva base del producto</li>
              <li>✔ Consola preparada para alojar Core y Transform</li>
              <li>✔ Camino abierto hacia conversión, masking y ETL básico</li>
            </ul>

            <p className="card-tag">Data_Link · Core · Transform path</p>
          </article>

          <article className="card card-muted">
            <div className="card-top">
              <h3>Status-Hub</h3>
              <span className="badge badge-live">LIVE</span>
            </div>

            <p>
              Capa de inteligencia operativa del ecosistema Evilink: monitorea salud,
              métricas reales y señales tempranas para servicios clave.
            </p>

            <ul className="card-list">
              <li>✔ Métricas reales construidas desde los servicios del ecosistema</li>
              <li>✔ Consola enriquecida con más visibilidad operativa</li>
              <li>✔ Base más sólida para una futura evolución hacia IO</li>
            </ul>

            <div className="card-actions">
              <a className="btn-mini" href="/status">
                Ver →
              </a>
            </div>

            <p className="card-tag">
              Observability · Metrics · IO path
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
              <li>Market360º + Derived Intelligence</li>
              <li>API enriquecida con datos de mercado</li>
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
              <li>Base para futuros insights</li>
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
              <li>Integración operativa con Nexus</li>
              <li>Coordinación guiada del ecosistema</li>
              <li>Ruta ligera para futuras integraciones</li>
            </ul>
          </article>

          <div className="flowArrow" aria-hidden>→</div>

          <article className="flowCard">
            <div className="flowTop">
              <span className="flowIcon" aria-hidden>📡</span>
              <div>
                <div className="flowTitle">Status-Hub</div>
                <div className="flowSub">Operations</div>
              </div>
            </div>

            <ul className="flowList">
              <li>Checks reales</li>
              <li>Métricas operativas</li>
              <li>Señales tempranas de degradación</li>
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
              La etapa actual se enfoca en consolidar productos existentes, observar estabilidad real
              y preparar piezas más robustas antes de cualquier expansión.
            </p>

            <ul className="card-list">
              <li>✔ V-Secrets y Data_Link avanzan hacia una etapa más productiva y profesional</li>
              <li>✔ CryptoLink y Social_Link fortalecen la capa de inteligencia de mercado</li>
              <li>✔ Status-Hub continúa madurando como capa de observabilidad del ecosistema</li>
              <li>✔ El mes se mantiene enfocado en hardening, integración y estabilidad</li>
            </ul>

            <p className="card-tag">Hardening · consolidation · product maturity</p>
          </article>

          {/* NEXT */}
          <article className="card">
            <div className="card-top">
              <h3>Next</h3>
              <span className="badge badge-next">NEXT</span>
            </div>

            <p>
              Las siguientes prioridades se concentran en productos con avance real, revisión técnica
              y preparación para una etapa pública más fuerte.
            </p>

            <ul className="card-list">
              <li>✔ Secure_Link se perfila como candidato serio para una próxima etapa en producción</li>
              <li>✔ Data_Link Transform será revisado para definir alcance, utilidad y madurez</li>
              <li>✔ Curpify será evaluado para definir su siguiente evolución técnica y comercial</li>
              <li>✔ Nexus-slim, evi-gateway y MCP-One seguirán en observación como ruta de integración</li>
            </ul>

            <p className="card-tag">Security · data transform · integration review</p>
          </article>

          {/* SOON */}
          <article className="card card-muted">
            <div className="card-top">
              <h3>Soon</h3>
              <span className="badge badge-soon">Q4</span>
            </div>

            <p>
              Líneas con base técnica o dirección inicial que se mantendrán en análisis mientras
              se consolidan los candidatos principales del ecosistema.
            </p>

            <ul className="card-list">
              <li>✔ SignVerify permanece como candidato avanzado para una siguiente etapa de verificación</li>
              <li>✔ Email Deliverability será replanteado con nuevo enfoque y nombre por confirmar</li>
              <li>✔ Behavioral Shield continuará en radar dentro de la línea de seguridad</li>
              <li>✔ Vision_Link se mantiene en incubación mientras se define su dirección final</li>
            </ul>

            <p className="card-tag">Verification · security radar · incubation</p>
          </article>

          {/* STRATEGIC LINE */}
          <article className="card card-muted">
            <div className="card-top">
              <h3>Strategic line</h3>
              <span className="badge badge-inc">INTERNAL</span>
            </div>

            <p>
              Las capacidades internas del ecosistema seguirán evolucionando para reducir fricción,
              acelerar entregas y evitar que una sola pieza concentre demasiadas responsabilidades.
            </p>

            <ul className="card-list">
              <li>✔ EviForge continúa como tooling interno para acelerar bases cloud-ready</li>
              <li>✔ La estrategia favorece piezas ligeras, satélite y bien delimitadas</li>
              <li>✔ Nuevas ideas permanecen en papel mientras se fortalece el ecosistema existente</li>
            </ul>

            <p className="card-tag">Internal tooling · satellite architecture · no new fronts</p>
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