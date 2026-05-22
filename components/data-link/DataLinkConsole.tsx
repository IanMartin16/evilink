// src/components/data-link/DataLinkConsole.tsx

"use client";

import { useEffect, useState } from "react";
import { SignupCard } from "./SignupCard";
import { DashboardSummary } from "./DashboardSummary";
import { ProcessFileCard } from "./ProcessFileCard";
import { CurrentJobResult } from "./CurrentJobResult";
import { RecentJobsTable } from "./RecentJobTable";
import { ApiKeyCard } from "./ApiKeyCard";
import { UpgradeCard } from "./UpgradeCard";
import {
  getDashboard,
  getStoredApiKey,
  signup,
  saveApiKey,
  clearApiKey,
  processFile,
  getJob,
  createCheckoutSession,
} from "@/lib/dataLinkApi";

export function DataLinkConsole() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const data = await getDashboard();
      setDashboard(data);
    } catch (err: any) {
        if (err.status === 401 || err.status === 403) {
          clearApiKey();
          setApiKey(null);
          setDashboard(null);
          setCurrentJob(null);
        }

      setError(err.message || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = getStoredApiKey();
    setApiKey(stored);

    if (stored) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, []);

  async function handleSignup(email: string) {
    const data = await signup(email);
    saveApiKey(data.api_key);
    setApiKey(data.api_key);
    await loadDashboard();
  }

  async function handleProcessFile(payload: {
    file: File;
    format: string;
    preset: string;
    filterField?: string;
    filterValue?: string;
    filterOperator?: string;
  }) {
    setError(null);
    setCurrentJob(null);

    const created = await processFile(payload);

    setCurrentJob({
      job_id: created.job_id,
      status: "PENDING",
    });

    pollJob(created.job_id);
  }

  async function pollJob(jobId: string) {
    const interval = setInterval(async () => {
      try {
        const job = await getJob(jobId);
        setCurrentJob(job);

        if (job.status === "COMPLETED" || job.status === "FAILED") {
          clearInterval(interval);
          await loadDashboard();
        }
      } catch (err: any) {
        clearInterval(interval);
        setError(err.message || "Could not fetch job status");
      }
    }, 3000);
  }

  function handleForgetDevice() {
    clearApiKey();
    setApiKey(null);
    setDashboard(null);
    setCurrentJob(null);
    setError(null);

    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/data-link");
    }
  }

  async function handleUseExistingKey(existingKey: string) {
    try {
      setError(null);

      saveApiKey(existingKey);
      setApiKey(existingKey);

      const data = await getDashboard();
      setDashboard(data);
    } catch (err: any) {
      clearApiKey();
      setApiKey(null);
      setDashboard(null);
      setCurrentJob(null);

      throw new Error(
        err.message || "Invalid API key. Please check it and try again."
      );
    }
  }

  async function handleUpgrade() {
    const data = await createCheckoutSession();

    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    }
  }

  if (loading) {
    return <div className="dl-page">Loading Data_Link Console...</div>;
  }

  if (!apiKey) {
    return <SignupCard 
            onSignup={handleSignup}
            onUseExistingKey={handleUseExistingKey} />;
  }

  return (
    <main className="dl-page">
      <div className="dl-shell">
      <section className="dl-header">
        <div className="dl-brand">
          <img
            src="/data-link-icon.png"
            alt="Data_Link"
            className="dl-brand-logo"
          />

          <div>
            <h1>Data_Link Console</h1>
            <p>Clean and prepare CSV/JSON files in seconds.</p>
          </div>
        </div>

        <div className="dl-header-actions">
          <a href="/" className="dl-home-link">
            ← evi_link Home
          </a>

          <div className="dl-status">
            <span className="dot" />
              {dashboard?.service?.status || "operational"}
          </div>
        </div>
      </section>

      {error && <div className="dl-error">{error}</div>}

      {dashboard && (
        <>
          <DashboardSummary dashboard={dashboard} />

          <section className="dl-grid">
            <ProcessFileCard
              dashboard={dashboard}
              onProcess={handleProcessFile}
            />

            <aside className="dl-side">
              <ApiKeyCard 
              apiKey={dashboard.api_key?.masked} 
              onForgetDevice={handleForgetDevice}
              />
              <UpgradeCard
                billing={dashboard.billing}
                limits={dashboard.limits}
                onUpgrade={handleUpgrade}
              />
            </aside>
          </section>

          {currentJob && <CurrentJobResult job={currentJob} />}

          <RecentJobsTable jobs={dashboard.recent_jobs || []} />
        </>
      )}
      </div>
    </main>
  );
}