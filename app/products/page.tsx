import { PRODUCTOS } from "../data/products";
import Link from "next/link";


export default function ProductosPage() {
  return (
    <main className="page">
      <header className="nav">
        <div className="logo-block">
          <Link href="/" aria-label="Ir a inicio">
            <img src="/logo-horizontal.png" alt="evi_link devs logo" />
          </Link>
        </div>

        <nav className="nav-links">
          <Link href="/">Inicio</Link>
          <Link href="/#products">Productos Destacados</Link>
        </nav>
      </header>
      <section className="section">
        <h2>Productos</h2>
        <p className="section-intro">Catálogo completo del ecosistema evi_link devs.</p>

        <div className="cards">
          {PRODUCTOS.map(p => (
            <article key={p.key} className="card">
              <div className="card-top">
                <h3>{p.nombre}</h3>
                <span className={`badge badge-${p.estado.replaceAll(" ", "-").toLowerCase()}`}>
                  {p.estado}
                </span>
              </div>
              <p>{p.desc}</p>
              <ul className="card-list">
                {p.bullets.map(b => <li key={b}>✔ {b}</li>)}
              </ul>
              <div className="card-actions">
                {p.links.map(l =>
                  l.external ? (
                    <a key={l.href} className="btn-mini" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
                  ) : (
                    <a key={l.href} className="btn-mini" href={l.href}>{l.label}</a>
                  )
                )}
              </div>
              {p.tag ? <p className="card-tag">{p.tag}</p> : null}
            </article>
          ))}
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


