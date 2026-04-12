"use client";

import { useEffect, useMemo, useState } from "react";

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

const POLL_INTERVAL_MS = Number(
  process.env.NEXT_PUBLIC_STATUS_HUB_POLL_INTERVAL_MS || 3600000
);

const STATUS_HUB_BASE_URL =
  process.env.NEXT_PUBLIC_STATUS_HUB_API_URL || "https://status-hub-api-production.up.railway.app";

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

function getStatusClasses(status: ServiceStatus): string {
  switch (status) {
    case "operational":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-300";
    case "degraded":
      return "border-amber-500/25 bg-amber-500/10 text-amber-300";
    case "maintenance":
      return "border-sky-500/25 bg-sky-500/10 text-sky-300";
    case "down":
      return "border-rose-500/25 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
}

export default function ServiceHealthStatusPage() {
  const [summary, setSummary] = useState<StatusSummaryResponse | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const endpoints = useMemo(() => {
    if (!STATUS_HUB_BASE_URL) return null;

    return {
      summary: `${STATUS_HUB_BASE_URL}/v1/status/summary`,
      status: `${STATUS_HUB_BASE_URL}/v1/status`,
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!endpoints) {
        if (mounted) setError("Status Hub URL is not configured.");
        return;
      }

      try {
        const [summaryRes, statusRes] = await Promise.all([
          fetch(endpoints.summary, { cache: "no-store" }),
          fetch(endpoints.status, { cache: "no-store" }),
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
  }, [endpoints]);

  if (error) {
    return (
      <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6">
        <h1 className="text-2xl font-semibold">Service Status</h1>
        <p className="mt-3 text-rose-300">Unable to load service health.</p>
        <p className="mt-2 text-sm text-rose-200/80">{error}</p>
      </section>
    );
  }

  if (!summary || !status) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Service Status</h1>
        <p className="mt-3 text-white/70">Loading operational overview...</p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_35%),#020817] p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white/40">
            Ecosystem Monitoring
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
            Service Status
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65 md:text-base">
            Live operational overview for key Evilink services and backend products.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${getStatusClasses(
            summary.overall_status
          )}`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-90" />
          <span>{getStatusLabel(summary.overall_status)}</span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Operational" value={summary.operational} />
        <MetricCard label="Degraded" value={summary.degraded} />
        <MetricCard label="Maintenance" value={summary.maintenance} />
        <MetricCard label="Down" value={summary.down} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/40">
          <div className="col-span-4 md:col-span-3">Service</div>
          <div className="col-span-3 md:col-span-2">Status</div>
          <div className="col-span-2 hidden md:block">Latency</div>
          <div className="col-span-3 hidden md:block">Last Check</div>
          <div className="col-span-5 md:col-span-4">Message</div>
        </div>

        <div className="divide-y divide-white/8">
          {status.services.map((service) => (
            <div
              key={service.name}
              className="grid grid-cols-12 gap-4 px-4 py-4 text-sm"
            >
              <div className="col-span-4 md:col-span-3 min-w-0">
                <div className="font-medium text-white">{service.display_name}</div>
                <div className="mt-1 text-xs text-white/40">{service.name}</div>
              </div>

              <div className="col-span-3 md:col-span-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${getStatusClasses(
                    service.status
                  )}`}
                >
                  <span className="h-2 w-2 rounded-full bg-current opacity-90" />
                  {getStatusLabel(service.status)}
                </span>
              </div>

              <div className="col-span-2 hidden text-white/70 md:block">
                {service.latency_ms !== null ? `${service.latency_ms} ms` : "—"}
              </div>

              <div className="col-span-3 hidden text-white/55 md:block">
                {formatDate(service.last_checked)}
              </div>

              <div className="col-span-5 md:col-span-4 text-white/65">
                {service.message || "No details"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 text-xs text-white/40">
        Last updated: {formatDate(summary.last_updated)}
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/35">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}