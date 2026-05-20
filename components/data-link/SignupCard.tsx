// src/components/data-link/SignupCard.tsx

"use client";

import { FormEvent, useState } from "react";

type SignupCardProps = {
  onSignup: (email: string) => Promise<void>;
};

export function SignupCard({ onSignup }: SignupCardProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
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

  return (
    <main className="dl-page dl-center">
      <section className="dl-auth-card">
        <div className="dl-logo-mark">D</div>

        <h1>Data_Link Console</h1>
        <p>
          Clean and prepare CSV/JSON files in seconds. Create a FREE key to start
          processing files.
        </p>

        <form onSubmit={handleSubmit} className="dl-auth-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          {error && <div className="dl-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create FREE API key"}
          </button>
        </form>

        <small>
          Your API key will be stored in this browser so you can use the console.
        </small>
      </section>
    </main>
  );
}