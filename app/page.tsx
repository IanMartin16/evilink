// app/page.tsx
export default function Home() {
  return (
    <main className="page">
      {/* NAVBAR */}
      <header className="nav">
       <div className="logo-block">
        <img src="/logo-horizontal.png" alt="evi_link devs logo" />
       </div>
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
            evi_link devs es un estudio de desarrollo enfocado en crear
            APIs, automatizaciones y servicios backend listos para
            producción. Hechos a mano, con obsesión por el detalle.
          </p>

          <div className="hero-actions">
            <a href="#products" className="btn-primary">
              Ver proyectos
            </a>
            <a
              href="https://curpify.com.mx"
              className="btn-secondary"
              target="_blank"
              rel="noreferrer"
            >
              Curpify (próximamente)
            </a>
          </div>

          <p className="hero-note">
            ✦ Primera API: <strong>Curpify</strong>, validación de CURP para
            integraciones en México.
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
        <h2>Proyectos y APIs</h2>
        <p className="section-intro">
          evi_link devs funciona como laboratorio y fábrica de productos.
          Estas son las primeras piezas del ecosistema.
        </p>

        <div className="cards">
          <article className="card">
            <h3>Curpify API</h3>
            <p>
              Servicio de validación de CURP para plataformas fintech,
              CRMs, sistemas de registro y cualquier aplicación que requiera
              verificar identidades en México.
            </p>
            <ul className="card-list">
              <li>✔ Validación rápida y consistente</li>
              <li>✔ Respuestas JSON</li>
              <li>✔ Integración sencilla vía HTTP</li>
            </ul>
            <div className="card-actions">
              <a href="#" className="link-disabled">
                Docs (muy pronto)
              </a>
            </div>
          </article>

          <article className="card card-muted">
            <h3>Próximas APIs</h3>
            <p>
              Integraciones para datos públicos, notificaciones, deportes
              y automatización de flujos cotidianos.
            </p>
            <ul className="card-list">
              <li>• API de noticias NFL</li>
              <li>• Servicios de notificación y alertas</li>
              <li>• Herramientas internas para DevOps</li>
            </ul>
            <p className="card-tag">Roadmap en construcción</p>
          </article>
        </div>
      </section>

      {/* ABOUT / FOOTER */}
      <section className="section section-soft">
        <h2>Sobre evi_link devs</h2>
        <p className="section-intro">
          evi_link devs nace como un estudio independiente de desarrollo,
          enfocado en servicios backend y APIs listos para producción:
          performance, observabilidad y soporte como prioridades.
        </p>
        <p className="section-intro">
          Actualmente operando desde Ciudad de México, con foco en proyectos
          que mezclan banca, automatización y servicios en la nube.
        </p>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} evi_link devs. All rights reserved.</p>
        <p className="footer-note">
          Sitio y APIs en desarrollo activo. Este proyecto se construye en paralelo
          a otras responsabilidades profesionales, sin afiliación con terceros.
        </p>
      </footer>
    </main>
  );
}
