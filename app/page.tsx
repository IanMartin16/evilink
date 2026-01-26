// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      {/* NAVBAR */}
      <header className="nav">
        <div className="logo-block">
          <img src="/logo-horizontal.png" alt="evi_link devs logo" />
        </div>

        {/* mini nav opcional */}
        <nav className="nav-links">
          <a href="#products">Productos</a>
          <Link href="#about">Sobre</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Construyendo APIs y productos
            <br />
            para el siguiente nivel.
          </h1>
          <p>
            evi_link devs es un estudio de desarrollo enfocado en crear APIs,
            automatizaciones y servicios backend listos para producción. Hechos
            con vision y enfoque con obsesión por el detalle.
          </p>

          <div className="hero-actions">
            <a href="#products" className="btn-secondary">
              Ver productos
            </a>

            {/*  tienes curpify.com */}
            <a
              href="https://curpify.com"
              className="btn-secondary"
              target="_blank"
              rel="noreferrer"
            >
              Curpify
            </a>
          </div>

          <p className="hero-note">
            ✦ Último release: <strong>CryptoLink</strong> (Stripe + API Keys +
            rate limit + SSE).
          </p>
        </div>

        <div className="hero-card">
          <h2>Stack principal</h2>
          <ul>
            <li>Node.js · TypeScript · Next.js</li>
            <li>APIs REST · Webhooks · Integraciones</li>
            <li>Vercel · AWS · Stripe · Git</li>
          </ul>
          <p className="hero-card-foot">
            Diseño orientado a performance, seguridad y mantenibilidad.
          </p>
        </div>
      </section>

     {/* PRODUCTS */}
<section id="products" className="section">
  <h2>Productos</h2>
  <p className="section-intro">
    Catálogo de APIs y herramientas del ecosistema evi_link devs. Cada producto tiene su landing y documentación.
  </p>

  {(() => {
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
        desc: "API de precios cripto con streaming (SSE), rate-limit por plan, API keys y checkout con Stripe.",
        bullets: [
          "SSE (event: price / ping)",
          "Planes por API Key (headers X-RateLimit-*)",
          "Webhooks Stripe → email + DB",
        ],
        links: [{ label: "Landing + Docs →", href: "/products/cryptolink" }],
        tag: "Railway · Stripe · Resend · Postgres",
      },
      {
        key: "curpify",
        name: "Curpify API",
        status: "LANZAMIENTO",
        desc: "Servicio de validación de CURP para fintech, CRMs y cualquier app que requiera verificar identidades en México.",
        bullets: [
          "Validación rápida y consistente",
          "Respuestas JSON",
          "Integración sencilla vía HTTP",
        ],
        links: [{ label: "Ver producto →", href: "https://curpify.com", external: true }],
        tag: "Next.js · Postgres · Stripe",
      },
      {
        key: "nexus",
        name: "Nexus",
        status: "EN DESARROLLO",
        desc: "Integraciones para datos públicos, notificaciones, deportes y automatización de flujos cotidianos.",
        bullets: [
          "API de deserialización de datos",
          "Servicios de notificación y alertas",
          "Herramientas internas para DevOps",
        ],
        links: [
          { label: "Roadmap", href: "#roadmap" },
          { label: "Join waitlist", href: "mailto:support@evilink.dev?subject=Nexus%20waitlist", external: true },
        ],
        tag: "Roadmap en construcción",
        muted: true,
      },
    ];

    const badgeClass = (s: Status) => {
      if (s === "DISPONIBLE") return "badge badge-live";
      if (s === "LANZAMIENTO") return "badge badge-launch";
      return "badge badge-dev";
    };

    return (
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
                  const cls = "btn-mini"; // una sola clase para todos
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
    );
  })()}
</section>

      {/* ABOUT / FOOTER */}
      <section id="about" >
        <div className="card">
          <div className="card-top">
            <article className="card card-muted">
              <h2 className="card-title">Sobre</h2>
              <p>
              evi_link devs nace como un estudio independiente de desarrollo, enfocado
              en servicios backend y APIs listos para producción: performance,
              observabilidad y soporte como prioridades. Actualmente operando desde Ciudad de México,
              con foco en proyectos que mezclan banca, automatización y servicios en la nube.
              </p>
            </article>
          </div>
         </div>
        </section> 

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} evi_link devs. All rights reserved.</p>

          <div className="footer-contact">
            <span>Contacto:</span>
            <a href="mailto:support@evilink.dev">support@evilink.dev</a>
            <span className="dot"> • </span>
            <a href="mailto:billing@evilink.dev">billing@evilink.dev</a>
          </div>

          <p className="footer-note">
            Sitio y APIs en desarrollo activo. Este proyecto se construye en paralelo a otras
            responsabilidades profesionales, sin afiliación con terceros.
          </p>
          </div>
        </footer>

    </main>
  );
}
