// src/components/data-link/SignupCard.tsx

"use client";

import { FormEvent, useState } from "react";

type SignupCardProps = {
  onSignup: (email: string) => Promise<void>;
  onUseExistingKey: (apiKey: string) => Promise<void>;
};

export function SignupCard({ onSignup, onUseExistingKey }: SignupCardProps) {
  const [mode, setMode] = useState<"signup" | "existing">("signup");
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignupSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      await onSignup(email.trim());
    } catch (err: any) {
      setError(err.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleExistingKeySubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!apiKey.trim()) {
      setError("Enter your API key.");
      return;
    }

    try {
      setLoading(true);
      await onUseExistingKey(apiKey.trim());
    } catch (err: any) {
      setError(err.message || "Invalid API key or could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dl-page dl-center">
      <section className="dl-auth-card">
        <img
            src="/data-link-icon.png"
            alt="Data_Link"
            className="dl-brand-logo"
          />

        <h1>Data_Link Console</h1>
        <p>
          Clean and prepare CSV/JSON files in seconds. Create a FREE key or use
          an existing API key.
        </p>

        <div className="dl-auth-tabs">
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Create key
          </button>

          <button
            type="button"
            className={mode === "existing" ? "active" : ""}
            onClick={() => {
              setMode("existing");
              setError("");
            }}
          >
            I have a key
          </button>
        </div>

        {mode === "signup" ? (
          <form onSubmit={handleSignupSubmit} className="dl-auth-form">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            {error && <div className="dl-error">{error}</div>}

            <button className="dl-primary-btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create FREE API key"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleExistingKeySubmit} className="dl-auth-form">
            <label>API Key</label>
            <input
              type="password"
              placeholder="Paste your Data_Link API key"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />

            {error && <div className="dl-error">{error}</div>}

            <button className="dl-primary-btn" type="submit" disabled={loading}>
              {loading ? "Loading dashboard..." : "Use this API key"}
            </button>
          </form>
        )}

        <small>
          Your API key is stored only in this browser. Use “Forget this device”
          when working on a shared computer.
        </small>
      </section>
    </main>
  );
}