// components/cryptolink/DocsRenderer.tsx
"use client";

import Link from "next/link";

type Props = {
  docs: any;
};

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="code">
      <pre><code>{code}</code></pre>
    </div>
  );
}

export default function DocsRenderer({ docs }: Props) {
  return (
    <main className="page">
      <header className="nav">
        <div className="logo-block">
          <Link href="/" aria-label="Ir a inicio">
            <img src="/logo-horizontal.png" alt="evi_link devs logo" />
          </Link>
        </div>

        <nav className="nav-links">
          <Link href="/products">Productos</Link>
          <a href="#quickstart">Quickstart</a>
          <a href="#endpoints">Endpoints</a>
          <a href="#limits">Planes</a>
          <a href="#errors">Errores</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <div className="kicker">
            <span className="badge">DOCS</span>
            <span className="kicker-dot">•</span>
            <span className="kicker-text">{docs.product.tagline}</span>
          </div>

          <h1>{docs.product.name} · Docs</h1>
          <p>
            Base URL: <strong>{docs.baseUrl}</strong>
            <br />
            Auth: <code>{docs.auth.header}</code>
          </p>

          <div className="hero-actions">
            <a className="btn-secondary" href="#quickstart">Ver quickstart</a>
            <a className="btn-secondary" href="/products/cryptolink">Ir a landing</a>
          </div>

          <p className="hero-note">
            Para Nexus/bot: <code>/api/docs/cryptolink</code>
          </p>
        </div>

        <div className="hero-card">
          <h2>Nota importante</h2>
          <ul>
            <li>Max symbols (plan) vs symbols disponibles (hoy).</li>
            <li>Hoy disponibles: <strong>{docs.limits.availableSymbolsToday}</strong></li>
          </ul>
        </div>
      </section>

      <section id="quickstart" className="section">
        <h2>Quickstart</h2>
        <p className="section-intro">{docs.auth.note}</p>

        <div className="cards">
          {docs.endpoints
            .filter((e: any) => e.id === "prices" || e.id === "sse_prices")
            .map((e: any) => (
              <article key={e.id} className="card">
                <h3>{e.title}</h3>
                <p><code>{e.method}</code> <code>{e.path}</code></p>
                {e.examples?.map((ex: any, i: number) => (
                  <div key={i} style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>{ex.title}</div>
                    <CodeBlock code={ex.code} />
                  </div>
                ))}
              </article>
            ))}
        </div>
      </section>

      <section id="endpoints" className="section section-soft">
        <h2>Endpoints</h2>
        <p className="section-intro">Referencia completa.</p>

        <div className="cards">
          {docs.endpoints.map((e: any) => (
            <article key={e.id} className="card">
              <div className="card-top">
                <h3>{e.title}</h3>
                <span className="badge">{e.method}</span>
              </div>

              <p><code>{e.path}</code></p>

              {e.query?.length ? (
                <>
                  <h4 style={{ marginTop: 12 }}>Query params</h4>
                  <ul className="card-list">
                    {e.query.map((q: any) => (
                      <li key={q.name}>
                        <code>{q.name}</code>{q.required ? " (req)" : ""} — <span style={{ opacity: 0.85 }}>{q.notes}</span>{" "}
                        {q.example ? <span style={{ opacity: 0.85 }}>Ej: <code>{q.example}</code></span> : null}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {e.examples?.map((ex: any, i: number) => (
                <div key={i} style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{ex.title}</div>
                  <CodeBlock code={ex.code} />
                </div>
              ))}

              {e.responses?.length ? (
                <>
                  <h4 style={{ marginTop: 12 }}>Respuestas</h4>
                  <ul className="card-list">
                    {e.responses.map((r: any, i: number) => (
                      <li key={i}>
                        <strong>{r.status}</strong> — {r.description}
                        {r.example ? (
                          <div style={{ marginTop: 8 }}>
                            <CodeBlock code={r.example} />
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section id="limits" className="section">
        <h2>Planes y límites</h2>
        <p className="section-intro">
          Importante: hoy hay <strong>{docs.limits.availableSymbolsToday}</strong> symbols disponibles.
          En el proximo upgrade se tiene planeado aumentar a 20 en el Plan PRO y 15 al Plan BUSINESS.
        </p>

        <div className="cards">
          {Object.entries(docs.limits.maxSymbolsPlan).map(([plan, max]: any) => (
            <article key={plan} className="card">
              <h3>{plan}</h3>
              <ul className="card-list">
                <li>✔ Max symbols (plan): <strong>{max}</strong></li>
                <li>• Symbols disponibles hoy: <strong>{docs.limits.availableSymbolsToday}</strong></li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="errors" className="section section-soft">
        <h2>Errores y debugging</h2>
        <div className="cards">
          <article className="card">
            <h3>Headers útiles</h3>
            <ul className="card-list">
              <li>• <code>X-Plan</code></li>
              <li>• <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>, <code>X-RateLimit-Used</code></li>
              <li>• <code>X-Request-Id</code> (pásalo en soporte)</li>
            </ul>
          </article>

          <article className="card">
            <h3>Recomendación</h3>
            <p className="hint">
              Para 5xx: reintenta. Para 429: backoff. Para 401: revisa tu API key.
            </p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} evi_link devs. All rights reserved.</p>
        <p className="footer-note">
          Docs schema: <code>{docs.schema}</code> · version: <code>{docs.version}</code>
        </p>
      </footer>
    </main>
  );
}
