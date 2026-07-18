// src/components/data-link/ApiKeyCard.tsx

"use client";

import { useState } from "react";
import {
  apiFetch,
  getStoredApiKey,
} from "@/lib/dataLinkApi";

type ApiKeyCardProps = {
  apiKey?: string;
  onForgetDevice: () => void;
};

export function ApiKeyCard({
  apiKey,
  onForgetDevice,
}: ApiKeyCardProps) {
  const [billingLoading, setBillingLoading] =
    useState(false);
  const [billingError, setBillingError] =
    useState<string | null>(null);

  async function copyKey() {
    const fullKey = getStoredApiKey();
    if (!fullKey) return;

    await navigator.clipboard.writeText(fullKey);
  }

  async function manageSubscription() {
  try {
    setBillingLoading(true);
    setBillingError(null);

    const data = await apiFetch(
      "/api/v1/billing/portal-session",
      {
        method: "POST",
      }
    );

    if (!data?.portal_url) {
      throw new Error(
        "Billing portal URL was not returned."
      );
    }

    window.location.href = data.portal_url;
  } catch (error) {
    setBillingError(
      error instanceof Error
        ? error.message
        : "Unexpected billing error."
    );
  } finally {
    setBillingLoading(false);
  }
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

      <div className="dl-key-box">
        {apiKey || "No API key"}
      </div>

      <div className="dl-api-actions">
        <button
          className="dl-secondary-btn"
          onClick={copyKey}
          disabled={!apiKey}
        >
          Copy API key
        </button>

        <button
          className="dl-danger-btn"
          onClick={onForgetDevice}
        >
          Forget this device
        </button>
      </div>

      <div className="dl-billing-actions">
        <button
          className="dl-secondary-btn"
          onClick={manageSubscription}
          disabled={billingLoading || !apiKey}
        >
          {billingLoading
            ? "Opening billing..."
            : "Manage subscription"}
        </button>

        {billingError && (
          <p className="dl-error-text">
            {billingError}
          </p>
        )}
      </div>

      <small className="dl-security-note">
        Use “Forget this device” when working on a shared or public computer.
      </small>
    </section>
  );
}