"use client";

import { useEffect, useState } from "react";

type ServiceStatus = "operational" | "degraded" | "maintenance" | "down";

type StatusSummaryResponse = {
  overall_status: ServiceStatus;
  operational: number;
  degraded: number;
  maintenance: number;
  down: number;
  last_updated: string;
};

type ServiceStatusItem = {
  name: string;
  display_name: string;
  status: ServiceStatus;
  latency_ms: number | null;
  last_checked: string;
  message: string | null;
};

type StatusResponse = {
  overall_status: ServiceStatus;
  last_updated: string;
  services: ServiceStatusItem[];
};

const STATUS_HUB_BASE_URL =
  process.env.NEXT_PUBLIC_STATUS_HUB_API_URL || "https://status-hub-api-production.up.railway.app";

const POLL_INTERVAL_MS = Number(
  process.env.NEXT_PUBLIC_STATUS_HUB_POLL_INTERVAL_MS || 3600000
);

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

function getStatusLabel(status: ServiceStatus): string {
  switch (status) {
    case "operational":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "maintenance":
      return "Maintenance";
    case "down":
      return "Down";
    default:
      return status;
  }
}

export default function StatusPage() {
  const [summary, setSummary] = useState<StatusSummaryResponse | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!STATUS_HUB_BASE_URL) {
        if (mounted) {
          setError("NEXT_PUBLIC_STATUS_HUB_API_URL is not configured.");
        }
        return;
      }

      try {
        const [summaryRes, statusRes] = await Promise.all([
          fetch(`${STATUS_HUB_BASE_URL}/v1/status/summary`, { cache: "no-store" }),
          fetch(`${STATUS_HUB_BASE_URL}/v1/status`, { cache: "no-store" }),
        ]);

        if (!summaryRes.ok || !statusRes.ok) {
          throw new Error("Unable to fetch service health.");
        }

        const [summaryData, statusData] = await Promise.all([
          summaryRes.json() as Promise<StatusSummaryResponse>,
          statusRes.json() as Promise<StatusResponse>,
        ]);

        if (!mounted) return;

        setSummary(summaryData);
        setStatus(statusData);
        setError(null);
      } catch (err) {
        console.error("Status page error:", err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="page">
      <section className="status-shell">
        <div className="status-hero">
          <div>
            <div className="status-eyebrow">Ecosystem Monitoring</div>
            <h1>Service Status</h1>
            <p>
              Live operational overview for key Evilink services and backend products.
            </p>
          </div>

          {summary ? (
            <div className={`status-pill status-pill--${summary.overall_status}`}>
              <span className="status-pill-dot" />
              {getStatusLabel(summary.overall_status)}
            </div>
          ) : null}
        </div>

        {error ? (
          <section className="status-error">
            <h2>Unable to load service health.</h2>
            <p>{error}</p>
          </section>
        ) : null}

        {summary ? (
          <section className="status-summary">
            <div className="status-metric">
              <span>Operational</span>
              <strong>{summary.operational}</strong>
            </div>
            <div className="status-metric">
              <span>Degraded</span>
              <strong>{summary.degraded}</strong>
            </div>
            <div className="status-metric">
              <span>Maintenance</span>
              <strong>{summary.maintenance}</strong>
            </div>
            <div className="status-metric">
              <span>Down</span>
              <strong>{summary.down}</strong>
            </div>
          </section>
        ) : null}

        {status ? (
          <section className="status-board">
            <div className="status-board-head">
              <div>Service</div>
              <div>Status</div>
              <div>Latency</div>
              <div>Last Check</div>
              <div>Message</div>
            </div>

            <div className="status-board-body">
              {status.services.map((service) => (
                <article key={service.name} className="status-row">
                  <div className="status-service">
                    <strong>{service.display_name}</strong>
                    <span>{service.name}</span>
                  </div>

                  <div>
                    <span className={`status-badge status-badge--${service.status}`}>
                      {getStatusLabel(service.status)}
                    </span>
                  </div>

                  <div>{service.latency_ms !== null ? `${service.latency_ms} ms` : "—"}</div>
                  <div>{formatDate(service.last_checked)}</div>
                  <div>{service.message || "No details"}</div>
                </article>
              ))}
            </div>
          </section>
        ) : !error ? (
          <section className="status-loading">
            <p>Loading operational overview...</p>
          </section>
        ) : null}

        {summary ? (
          <div className="status-foot">
            Last updated: {formatDate(summary.last_updated)}
          </div>
        ) : null}
      </section>
    </main>
  );
}