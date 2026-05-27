"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceStatus = "operational" | "degraded" | "maintenance" | "down" | "platform_issue" | "unknown";

type StatusSummaryResponse = {
  overall_status: ServiceStatus;
  operational: number;
  degraded: number;
  maintenance: number;
  down: number;
  platform_issue: number;
  unknown: number;
  last_updated: string;
};

type ServiceStatusItem = {
  http_status: string;
  name: string;
  display_name: string;
  status: ServiceStatus;
  latency_ms: number | null;
  last_checked: string;
  last_status_change_at: string | null;
  consecutive_failures: number;
  message: string | null;
  recent_events: ServiceCheckEventItem[];
};

type ServiceCheckEventItem = {
  status: ServiceStatus;
  latency_ms: number | null;
  http_status: number | null;
  checked_at: string;
  message: string | null;
};

type StatusResponse = {
  overall_status: ServiceStatus;
  last_updated: string;
  services: ServiceStatusItem[];
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_HUB_BASE_URL =
  process.env.NEXT_PUBLIC_STATUS_HUB_API_URL ||
  "https://status-hub-api-production.up.railway.app";

const POLL_INTERVAL_MS = Number(
  process.env.NEXT_PUBLIC_STATUS_HUB_POLL_INTERVAL_MS || 3600000
);

const UPTIME_BARS = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function relativeTime(value: string): string {
  try {
    const diff = Date.now() - new Date(value).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return ` ${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return ` ${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
  } catch {
    return formatDate(value);
  }
}

function getStatusLabel(status: ServiceStatus): string {
  return (
    { operational: "Operational", degraded: "Degraded", maintenance: "Maintenance", down: "Down", platform_issue: "Platform Issue", unknown: "Unknown" }[status] ?? status
  );
}

function getLatencyColor(ms: number | null): string {
  if (ms === null) return "var(--c-muted)";
  if (ms < 200) return "var(--c-green)";
  if (ms < 600) return "var(--c-amber)";
  return "var(--c-red)";
}

/**
 * Deterministic pseudo-random uptime history seeded by service name.
 * Produces consistent bars across renders without real historical data.
 */
function generateUptimeBars(name: string, currentStatus: ServiceStatus): ServiceStatus[] {
  let seed = 0;
  for (let i = 0; i < name.length; i++) seed = (seed * 31 + name.charCodeAt(i)) >>> 0;

  const bars: ServiceStatus[] = [];
  for (let i = 0; i < UPTIME_BARS - 1; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const r = seed / 0xffffffff;
    if (r > 0.97) bars.push("down");
    else if (r > 0.96) bars.push("platform_issue");
    else if (r > 0.93) bars.push("degraded");
    else bars.push("operational");
  }
  bars.push(currentStatus);
  return bars;
}

function getUptimeBarsFromEvents(
  events: ServiceCheckEventItem[] | undefined,
  currentStatus: ServiceStatus
): ServiceStatus[] {
  if (!events || events.length === 0) {
    return [currentStatus];
  }

  const bars = events
    .slice(-UPTIME_BARS)
    .map((event) => event.status);

  return bars.length > 0 ? bars : [currentStatus];
}

function uptimePercent(bars: ServiceStatus[]): string {
  const ok = bars.filter((b) => b === "operational").length;
  return ((ok / bars.length) * 100).toFixed(1);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: ServiceStatus }) {
  return <span className={`s-dot s-dot--${status}`} aria-hidden />;
}

function UptimeBars({
  events,
  status,
}: {
  events: ServiceCheckEventItem[] | undefined;
  status: ServiceStatus;
}) {
  const bars = getUptimeBarsFromEvents(events, status);
  const pct = uptimePercent(bars);

  return (
    <div className="uptime-wrap">
      <div className="uptime-bars" title={`${pct}% uptime — last ${bars.length} checks`}>
        {bars.map((b, i) => (
          <span key={i} className={`uptime-bar uptime-bar--${b}`} />
        ))}
      </div>
      <span className="uptime-pct">{pct}%</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="s-row s-row--sk">
      <div className="sk sk--name" />
      <div className="sk sk--badge" />
      <div className="sk sk--sm" />
      <div className="sk sk--bars" />
      <div className="sk sk--md" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StatusPage() {
  const [summary, setSummary] = useState<StatusSummaryResponse | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!STATUS_HUB_BASE_URL) {
        if (mounted) setError("NEXT_PUBLIC_STATUS_HUB_API_URL is not configured.");
        return;
      }
      try {
        const [sr, dr] = await Promise.all([
          fetch(`${STATUS_HUB_BASE_URL}/v1/status/summary`, { cache: "no-store" }),
          fetch(`${STATUS_HUB_BASE_URL}/v1/status`, { cache: "no-store" }),
        ]);
        if (!sr.ok || !dr.ok) throw new Error("Unable to fetch service health.");
        const [summaryData, statusData] = await Promise.all([
          sr.json() as Promise<StatusSummaryResponse>,
          dr.json() as Promise<StatusResponse>,
        ]);
        if (!mounted) return;
        setSummary(summaryData);
        setStatus(statusData);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const t = setInterval(load, POLL_INTERVAL_MS);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  return (
    <>
      <style>{css}</style>

      <main className="sp-root">
        <div className="sp-shell">

          {/* Hero */}
          <header className="sp-hero">
            <section className="status-hero">
              <div className="status-hero-brand">
                <img
                  src="/status-hub-icon.png"
                  alt="Status-hub"
                  className="status-hero-icon"
                />

                <div className="status-hero-copy">
                  <p className="status-eyebrow">INTELLIGENCE OBSERVABILITY</p>

                  <h1>STATUS-HUB</h1>

                  <h2>IO — Intelligence Observability</h2>

                  <p>
                    Live operational visibility for key Evilink services,
                    ecosystem products, and platform health signals.
                  </p>
                </div>
              </div>

              {summary && (
              <div className={`sp-pill sp-pill--${summary.overall_status}`}>
                <StatusDot status={summary.overall_status} />
                {getStatusLabel(summary.overall_status)}
              </div>
            )}
            </section>
          </header>

          {/* Error */}
          {error && (
            <div className="sp-error">
              <span>⚠</span>
              <div>
                <strong>Unable to load service health</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Metrics */}
          {summary && (
            <div className="sp-metrics">
              {(
                [
                  { key: "operational", label: "Operational", value: summary.operational },
                  { key: "degraded",    label: "Degraded",    value: summary.degraded },
                  { key: "platform_issue", label: "Platform Issue", value: summary.platform_issue ?? 0},
                  { key: "maintenance", label: "Maintenance", value: summary.maintenance },
                  { key: "down",        label: "Down",        value: summary.down },
                  { key: "unknown", label: "Unknown", value: summary.unknown ?? 0},
                ] as const
              ).map(({ key, label, value }) => (
                <div key={key} className={`sp-metric sp-metric--${key}`}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Board */}
          <div className="sp-board">
            <div className="sp-head">
              <div>Service</div>
              <div>Status</div>
              <div>Latency</div>
              <div>Consistency — last {UPTIME_BARS} checks</div>
              <div>Last Check</div>
            </div>

            <div className="sp-body">
              {loading && !status && (
                <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
              )}

              {status?.services.map((svc) => (
                <article key={svc.name} className={`s-row s-row--${svc.status}`}>
                  <div className="s-svc">
                    <strong>{svc.display_name}</strong>
                    <span>{svc.name}</span>

                    {svc.message && <em>{svc.message}</em>}

                    <div className="s-meta">
                      <small>HTTP: {svc.http_status ?? "N/A"}</small>
                      <small>Failures: {svc.consecutive_failures ?? 0}</small>
                      {svc.last_status_change_at && (
                        <small>Changed: {relativeTime(svc.last_status_change_at)}</small>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className={`s-badge s-badge--${svc.status}`}>
                      <StatusDot status={svc.status} />
                      {getStatusLabel(svc.status)}
                    </span>
                  </div>

                  <div className="s-latency" style={{ color: getLatencyColor(svc.latency_ms) }}>
                    {svc.latency_ms !== null
                      ? <><b>{svc.latency_ms}</b><span> ms</span></>
                      : "—"}
                  </div>

                  <UptimeBars events={svc.recent_events} status={svc.status} />

                  <div className="s-time" title={formatDate(svc.last_checked)}>
                    {relativeTime  (svc.last_checked)}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Footer */}
          {summary && (
            <footer className="sp-foot">
              <StatusDot status={summary.overall_status} />
              Last updated: {formatDate(summary.last_updated)}
              <nav className="nav-links">
              <Link href="/">Inicio</Link>
            </nav>
            </footer>
          )}
        </div>
      </main>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const css = `
  .sp-root {
    --c-green : #4ade80;
    --c-amber : #fbbf24;
    --c-orange: #fb923c;
    --c-red   : #f87171;
    --c-blue  : #60a5fa;
    --c-muted : #64748b;

    --border  : rgba(255,255,255,.09);
    --s1      : rgba(255,255,255,.03);
    --s2      : rgba(255,255,255,.06);

    --text    : #e2e8f0;
    --r-md    : 10px;
    --r-lg    : 14px;

    padding: 3rem 1.25rem 5rem;
    color: var(--text);
    font-family: inherit;
  }

  .sp-shell {
    max-width: 1080px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  /* ── Hero ── */
  .sp-hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.25rem;
  }
  .sp-eyebrow {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--c-green);
    margin: 0 0 .4rem;
  }
  .sp-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -.025em;
    margin: 0 0 .4rem;
    line-height: 1.1;
  }
  .sp-sub {
    font-size: .875rem;
    color: var(--c-muted);
    margin: 0;
    max-width: 480px;
  }

  /* ── Overall pill ── */
  .sp-pill {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    padding: .45rem .9rem;
    border-radius: 999px;
    font-size: .75rem;
    font-weight: 700;
    letter-spacing: .04em;
    border: 1px solid;
    align-self: flex-start;
    margin-top: .25rem;
  }
  .sp-pill--operational { background: rgba(74,222,128,.08);  border-color: rgba(74,222,128,.25);  color: var(--c-green); }
  .sp-pill--degraded    { background: rgba(251,191,36,.08);  border-color: rgba(251,191,36,.25);  color: var(--c-amber); }
  .sp-pill--maintenance { background: rgba(96,165,250,.08);  border-color: rgba(96,165,250,.25);  color: var(--c-blue);  }
  .sp-pill--down        { background: rgba(248,113,113,.08); border-color: rgba(248,113,113,.25); color: var(--c-red);   }

  /* ── Status dot ── */
  .s-dot {
    display: inline-block;
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .s-dot--operational { background: var(--c-green); animation: glow-g 2.5s ease-in-out infinite; }
  .s-dot--degraded    { background: var(--c-amber); animation: glow-a 2.5s ease-in-out infinite; }
  .s-dot--maintenance { background: var(--c-blue); }
  .s-dot--down        { background: var(--c-red);  animation: glow-r 1.8s ease-in-out infinite; }

  @keyframes glow-g { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.6)}  50%{box-shadow:0 0 0 5px rgba(74,222,128,0)} }
  @keyframes glow-a { 0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,.6)}  50%{box-shadow:0 0 0 5px rgba(251,191,36,0)} }
  @keyframes glow-r { 0%,100%{box-shadow:0 0 0 0 rgba(248,113,113,.7)} 50%{box-shadow:0 0 0 5px rgba(248,113,113,0)} }

  /* ── Error ── */
  .sp-error {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    border-radius: var(--r-md);
    border: 1px solid rgba(248,113,113,.3);
    background: rgba(248,113,113,.06);
    color: var(--c-red);
    font-size: .875rem;
  }
  .sp-error strong { display: block; margin-bottom: .2rem; }
  .sp-error p      { margin: 0; color: var(--c-muted); }

  /* ── Metrics ── */
  .sp-metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: .75rem;
  }
  .sp-metric {
    background: var(--s1);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 1.1rem 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    gap: .25rem;
    position: relative;
    overflow: hidden;
  }
  /* bottom color bar */
  .sp-metric::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 0 0 var(--r-md) var(--r-md);
  }
  .sp-metric--operational::before { background: var(--c-green); }
  .sp-metric--degraded::before    { background: var(--c-amber); }
  .sp-metric--maintenance::before { background: var(--c-blue);  }
  .sp-metric--down::before        { background: var(--c-red);   }

  .sp-metric strong {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -.04em;
  }
  .sp-metric--operational strong { color: var(--c-green); }
  .sp-metric--degraded    strong { color: var(--c-amber); }
  .sp-metric--maintenance strong { color: var(--c-blue);  }
  .sp-metric--down        strong { color: var(--c-red);   }

  .sp-metric span {
    font-size: .67rem;
    font-weight: 600;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: var(--c-muted);
  }

  /* ── Board ── */
  .sp-board {
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--s1);
  }
  .sp-head {
    display: grid;
    grid-template-columns: 2fr 1fr .8fr 2fr .9fr;
    gap: 1rem;
    padding: .7rem 1.25rem;
    font-size: .64rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--c-muted);
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,.02);
  }
  .sp-body { display: flex; flex-direction: column; }

  /* ── Row ── */
  .s-row {
    display: grid;
    grid-template-columns: 2fr 1fr .8fr 2fr .9fr;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    align-items: center;
    position: relative;
    transition: background .15s;
    cursor: default;
  }
  .s-row:last-child  { border-bottom: none; }
  .s-row:hover       { background: var(--s2); }

  .s-row::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    opacity: 0;
    transition: opacity .2s;
  }
  .s-row:hover::before        { opacity: 1; }
  .s-row--operational::before { background: var(--c-green); }
  .s-row--degraded::before    { background: var(--c-amber); }
  .s-row--maintenance::before { background: var(--c-blue);  }
  .s-row--down::before        { background: var(--c-red);   }

  /* ── Service cell ── */
  .s-svc        { display: flex; flex-direction: column; gap: .1rem; min-width: 0; }
  .s-svc strong { font-size: .875rem; font-weight: 600; }
  .s-svc span   { font-size: .7rem; color: var(--c-muted); font-family: monospace; }
  .s-svc em     { font-size: .7rem; color: var(--c-amber); font-style: normal; margin-top: .1rem; }

  /* ── Badge ── */
  .s-badge {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    padding: .28rem .65rem;
    border-radius: 999px;
    font-size: .7rem;
    font-weight: 700;
    border: 1px solid;
    white-space: nowrap;
  }
  .s-badge--operational { background: rgba(74,222,128,.08);  border-color: rgba(74,222,128,.22);  color: var(--c-green); }
  .s-badge--degraded    { background: rgba(251,191,36,.08);  border-color: rgba(251,191,36,.22);  color: var(--c-amber); }
  .s-badge--maintenance { background: rgba(96,165,250,.08);  border-color: rgba(96,165,250,.22);  color: var(--c-blue);  }
  .s-badge--down        { background: rgba(248,113,113,.08); border-color: rgba(248,113,113,.22); color: var(--c-red);   }

  /* ── Latency ── */
  .s-latency      { font-size: .82rem; font-weight: 600; font-variant-numeric: tabular-nums; }
  .s-latency b    { font-weight: 700; }
  .s-latency span { font-size: .68rem; font-weight: 400; color: var(--c-muted); }

  /* ── Uptime bars ── */
  .uptime-wrap {
    display: flex;
    align-items: center;
    gap: .55rem;
  }
  .uptime-bars {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    flex: 1;
    height: 22px;
  }
  .uptime-bar {
    flex: 1;
    height: 18px;
    border-radius: 2px;
    transition: height .12s, opacity .12s;
    opacity: .8;
  }
  .uptime-bars:hover .uptime-bar         { opacity: .4; }
  .uptime-bars:hover .uptime-bar:hover   { opacity: 1; height: 22px; }

  .uptime-bar--operational { background: var(--c-green); }
  .uptime-bar--degraded    { background: var(--c-amber); }
  .uptime-bar--maintenance { background: var(--c-blue);  }
  .uptime-bar--down        { background: var(--c-red);   }

  .uptime-pct {
    font-size: .68rem;
    font-weight: 700;
    color: var(--c-muted);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    width: 3.5ch;
    text-align: right;
  }

  /* ── Time ── */
  .s-time {
    font-size: .78rem;
    color: var(--c-muted);
    font-variant-numeric: tabular-nums;
    cursor: default;
  }

  /* ── Skeleton ── */
  .s-row--sk {
    display: grid;
    grid-template-columns: 2fr 1fr .8fr 2fr .9fr;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    align-items: center;
  }
  .sk {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--border) 25%, rgba(255,255,255,.05) 50%, var(--border) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  .sk--name  { height: 34px; width: 75%; }
  .sk--badge { width: 90px; height: 22px; border-radius: 999px; }
  .sk--sm    { width: 48px; }
  .sk--bars  { height: 18px; }
  .sk--md    { width: 60px; }
  @keyframes shimmer { to { background-position: -200% 0; } }

  /* ── Footer ── */
  .sp-foot {
    display: flex;
    align-items: center;
    gap: .5rem;
    font-size: .75rem;
    color: var(--c-muted);
    padding: .25rem 0;
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .sp-metrics { grid-template-columns: repeat(2, 1fr); }
    .sp-head    { display: none; }
    .s-row, .s-row--sk {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto;
      row-gap: .75rem;
    }
    .s-svc      { grid-column: 1 / -1; }
    .uptime-wrap{ grid-column: 1 / -1; }
  }
  @media (max-width: 500px) {
    .sp-hero { flex-direction: column; }
    .sp-metrics { grid-template-columns: repeat(2, 1fr); }
  }

  /* ── New hardening states: platform_issue / unknown ── */
.sp-root {
  --c-orange: #fb923c;
}

/* Overall pill */
.sp-pill--platform_issue {
  background: rgba(251,146,60,.08);
  border-color: rgba(251,146,60,.25);
  color: var(--c-orange);
}

.sp-pill--unknown {
  background: rgba(100,116,139,.08);
  border-color: rgba(100,116,139,.25);
  color: var(--c-muted);
}

/* Status dot */
.s-dot--platform_issue {
  background: var(--c-orange);
  animation: glow-o 2.2s ease-in-out infinite;
}

.s-dot--unknown {
  background: var(--c-muted);
}

@keyframes glow-o {
  0%,100% { box-shadow: 0 0 0 0 rgba(251,146,60,.6); }
  50% { box-shadow: 0 0 0 5px rgba(251,146,60,0); }
}

/* Metrics */
.sp-metrics {
  grid-template-columns: repeat(6, 1fr);
}

.sp-metric--platform_issue::before {
  background: var(--c-orange);
}

.sp-metric--unknown::before {
  background: var(--c-muted);
}

.sp-metric--platform_issue strong {
  color: var(--c-orange);
}

.sp-metric--unknown strong {
  color: var(--c-muted);
}

/* Rows */
.s-row--platform_issue::before {
  background: var(--c-orange);
}

.s-row--unknown::before {
  background: var(--c-muted);
}

/* Badges */
.s-badge--platform_issue {
  background: rgba(251,146,60,.08);
  border-color: rgba(251,146,60,.22);
  color: var(--c-orange);
}

.s-badge--unknown {
  background: rgba(100,116,139,.08);
  border-color: rgba(100,116,139,.22);
  color: var(--c-muted);
}

/* Uptime bars */
.uptime-bar--platform_issue {
  background: var(--c-orange);
}

.uptime-bar--unknown {
  background: var(--c-muted);
}

/* Service metadata chips */
.s-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: .4rem;
  margin-top: .35rem;
}

.s-meta small {
  display: inline-flex;
  align-items: center;
  padding: .16rem .38rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  color: var(--c-muted);
  font-size: .62rem;
  font-family: inherit;
  line-height: 1.2;
}

.status-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  margin-bottom: 48px;
}

.status-hero-brand {
  display: flex;
  align-items: center;
  gap: 32px;
}

.status-hero-icon {
  width: clamp(110px, 12vw, 170px);
  height: auto;
  filter: drop-shadow(0 0 22px rgba(74, 222, 128, 0.22));
}

.status-eyebrow {
  margin: 0 0 14px;
  font-size: 0.85rem;
  letter-spacing: 0.24em;
  font-weight: 700;
  color: rgba(232, 220, 190, 0.78);
}

.status-hero-copy h1 {
  margin: 0;
  font-size: clamp(3.2rem, 5.0vw, 5.3rem);
  line-height: 0.95;
  letter-spacing: 0.025em;
  color: #f2e5cf;
}

.status-hero-copy h2 {
  margin: 14px 0 0;
  font-size: clamp(1.1rem, 1.5vw, 1.55rem);
  margin-top: 12px;
  line-height: 1.2;
  font-weight: 500;
  color: #e7d2b1;
}

.status-hero-copy p:last-child {
  margin: 14px 0 0;
  max-width: 760px;
  font-size: clamp(0.95rem, 1.05vw, 1.08rem);
  line-height: 1.45;
  color: rgba(235, 235, 225, 0.74);
}

/* Responsive metric grid for 6 cards */
@media (max-width: 980px) {
  .sp-metrics {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 500px) {
  .sp-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .status-hero {
    flex-direction: column;
  }

  .status-hero-brand {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .status-hero-copy h1 {
    font-size: clamp(3rem, 15vw, 4.5rem);
  }
}
`;
