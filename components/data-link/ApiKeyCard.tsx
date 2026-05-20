// src/components/data-link/ApiKeyCard.tsx

import { getStoredApiKey } from "@/lib/dataLinkApi";

type ApiKeyCardProps = {
  apiKey?: string;
};

export function ApiKeyCard({ apiKey }: ApiKeyCardProps) {
  async function copyKey() {
    const fullKey = getStoredApiKey();
    if (!fullKey) return;

    await navigator.clipboard.writeText(fullKey);
  }

  return (
    <section className="dl-panel dl-small-panel">
      <h2>API Key</h2>
      <p className="dl-muted">Stored in this browser for console usage.</p>

      <div className="dl-key-box">{apiKey || "No API key"}</div>

      <button className="dl-secondary-btn" onClick={copyKey}>
        Copy API key
      </button>
    </section>
  );
}