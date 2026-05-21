// src/components/data-link/ApiKeyCard.tsx

"use client";

import { getStoredApiKey } from "@/lib/dataLinkApi";

type ApiKeyCardProps = {
  apiKey?: string;
  onForgetDevice: () => void;
};

export function ApiKeyCard({ apiKey, onForgetDevice }: ApiKeyCardProps) {
  async function copyKey() {
    const fullKey = getStoredApiKey();
    if (!fullKey) return;

    await navigator.clipboard.writeText(fullKey);
  }

  return (
    <section className="dl-panel dl-small-panel">
      <div className="dl-api-card-header">
        <div>
          <h2>API Key</h2>
          <p className="dl-muted">
            Stored locally in this browser.
          </p>
        </div>
      </div>

      <div className="dl-key-box">{apiKey || "No API key"}</div>

      <div className="dl-api-actions">
        <button className="dl-secondary-btn" onClick={copyKey}>
          Copy API key
        </button>

        <button className="dl-danger-btn" onClick={onForgetDevice}>
          Forget this device
        </button>
      </div>

      <small className="dl-security-note">
        Use “Forget this device” when working on a shared or public computer.
      </small>
    </section>
  );
}