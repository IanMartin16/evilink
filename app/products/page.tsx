import Link from "next/link";

export default function ProductsPage() {
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
          <Link href="/#products">Home Products</Link>
        </nav>
      </header>

      <section className="section">
        <h2>Productos</h2>
        <p className="section-intro">
          Catálogo de APIs y herramientas del ecosistema evi_link devs.
        </p>

        <div className="cards">
          <article className="card">
            <div className="card-top">
              <h3>CryptoLink API</h3>
              <span className="badge">BETA</span>
            </div>

            <p>
              Precios cripto + streaming SSE en tiempo real, con límites por plan y API keys.
            </p>

            <ul className="card-list">
              <li>✔ REST + SSE</li>
              <li>✔ Rate limit por plan</li>
              <li>✔ Checkout Stripe + API Key por email</li>
            </ul>

            <div className="card-actions">
              <Link className="btn-secondary" href="/products/cryptolink">
                Ver landing
              </Link>
            </div>
          </article>

          <article className="card card-muted">
            <div className="card-top">
              <h3>Curpify API</h3>
              <span className="badge">PRÓXIMO</span>
            </div>

            <p>Validación de CURP para integraciones en México.</p>
            <p className="card-tag">Docs muy pronto</p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} evi_link devs. All rights reserved.</p>
      </footer>
    </main>
  );
}
