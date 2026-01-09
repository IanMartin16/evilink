// app/page.tsx
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
          <a href="#about">Sobre</a>
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
            a mano, con obsesión por el detalle.
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
          Catálogo de APIs y herramientas del ecosistema evi_link devs.
          Cada producto tiene su landing y documentación.
        </p>

        <div className="cards">
          {/* CryptoLink */}
          <article className="card">
            <div className="card-top">
              <h3>CryptoLink API</h3>
              <span className="badge badge-beta">BETA</span>
            </div>

            <p>
              API de precios cripto con soporte de streaming (SSE),
              rate-limit por plan, API keys y checkout con Stripe.
            </p>

            <ul className="card-list">
              <li>✔ SSE (event: price / ping)</li>
              <li>✔ Planes por API Key (headers X-RateLimit-*)</li>
              <li>✔ Webhooks Stripe → email + DB</li>
            </ul>

            <div className="card-actions">
              {/* Página interna (la crearemos) */}
              <a href="/products/cryptolink" className="btn-mini">
                Landing + Docs →
              </a>
            </div>

            <p className="card-tag">Railway · Stripe · Resend · Postgres</p>
          </article>

          {/* Curpify */}
          <article className="card">
            <div className="card-top">
              <h3>Curpify API</h3>
              <span className="badge badge-soon">PRÓXIMO</span>
            </div>

            <p>
              Servicio de validación de CURP para plataformas fintech,
              CRMs, sistemas de registro y cualquier app que requiera
              verificar identidades en México.
            </p>

            <ul className="card-list">
              <li>✔ Validación rápida y consistente</li>
              <li>✔ Respuestas JSON</li>
              <li>✔ Integración sencilla vía HTTP</li>
            </ul>

            <div className="card-actions">
              {/* si ya tienes curpify.com listo */}
              <a
                href="https://curpify.com"
                className="btn-mini"
                target="_blank"
                rel="noreferrer"
              >
                Ver producto →
              </a>

              {/* landing interno opcional (si luego quieres) */}
              {/* <a href="/products/curpify" className="btn-mini btn-mini-ghost">Docs →</a> */}
            </div>

            <p className="card-tag">Next.js · Postgres · Stripe</p>
          </article>

          {/* Coming soon */}
          <article className="card card-muted">
            <div className="card-top">
              <h3>Coming soon</h3>
              <span className="badge badge-muted">ROADMAP</span>
            </div>

            <p>
              Integraciones para datos públicos, notificaciones, deportes
              y automatización de flujos cotidianos.
            </p>

            <ul className="card-list">
              <li>• API de deserialización de datos</li>
              <li>• Servicios de notificación y alertas</li>
              <li>• Herramientas internas para DevOps</li>
            </ul>

            <p className="card-tag">Roadmap en construcción</p>
          </article>
        </div>
      </section>

      {/* ABOUT / FOOTER */}
      <section className="section section-soft">
        <div className="card-top">
      <article className="card card-muted">
        <h2>Sobre evi_link devs</h2>

        <p>
          evi_link devs nace como un estudio independiente de desarrollo, enfocado
          en servicios backend y APIs listos para producción: performance,
          observabilidad y soporte como prioridades.
          Actualmente operando desde Ciudad de México, con foco en proyectos que
          mezclan banca, automatización y servicios en la nube.
        </p>
      </article>
      </div>
      </section>


      <footer className="footer">
        <p>© {new Date().getFullYear()} evi_link devs. All rights reserved.</p>

       <div className="footer-contact">
           <span>Contacto:</span>
          <a href="mailto:support@evilink.dev"> support@evilink.dev</a>
           <span className="dot"> • </span>
          <a href="mailto:billing@evilink.dev"> billing@evilink.dev</a>
       </div>

        <p className="footer-note">
          Sitio y APIs en desarrollo activo. Este proyecto se construye en paralelo a otras
          responsabilidades profesionales, sin afiliación con terceros.
        </p>
      </footer>

    </main>
  );
}
