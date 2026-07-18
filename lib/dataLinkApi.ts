// src/lib/dataLinkApi.ts

const API_BASE = process.env.NEXT_PUBLIC_DATALINK_API_URL;

function extractApiError(body: any, fallback: string) {
  if (!body) return fallback;

  if (Array.isArray(body.detail)) {
    return body.detail
      .map((item: any) => item.msg || item.detail || "Validation error")
      .join(", ");
  }

  if (typeof body.detail === "string") {
    return body.detail;
  }

  if (typeof body.message === "string") {
    return body.message;
  }

  return fallback;
}

export function getStoredApiKey() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("datalink_api_key");
}

export function saveApiKey(apiKey: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("datalink_api_key", apiKey);
}

export function clearApiKey() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("datalink_api_key");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const apiKey = getStoredApiKey();

  const headers = new Headers(options.headers);

  if (apiKey) {
    headers.set("X-API-Key", apiKey);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let detail = "Request failed";

    try {
      const body = await res.json();
      detail = extractApiError(body, detail);
    } catch {
      // ignore
    }

    const error = new Error(detail) as Error & { status?: number };
    error.status = res.status;
    throw new Error(detail);
  }

  return res.json();
}

export async function signup(email: string) {
  const res = await fetch(`${API_BASE}/api/v1/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(extractApiError(body, "Signup failed"));
  }

  return res.json();
}

export async function getDashboard() {
  return apiFetch("/api/v1/dashboard");
}

export async function getJob(jobId: string) {
  return apiFetch(`/api/v1/jobs/${jobId}`);
}

export async function createCheckoutSession() {
  return apiFetch("/api/v1/billing/create-checkout-session", {
    method: "POST",
  });
}

export async function processFile(params: {
  file: File;
  format: string;
  preset: string;
  filterField?: string;
  filterValue?: string;
  filterOperator?: string;
}) {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    throw new Error("Missing API key");
  }

  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("format", params.format);
  formData.append("preset", params.preset);

  if (params.filterField) formData.append("filter_field", params.filterField);
  if (params.filterValue) formData.append("filter_value", params.filterValue);
  if (params.filterOperator) formData.append("filter_operator", params.filterOperator);

  const res = await fetch(`${API_BASE}/api/v1/process`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(extractApiError(body, "Processing failed"));
  }

  return res.json();
}

export function getDownloadUrl(downloadUrl: string) {
  return `${API_BASE}${downloadUrl}`;
}

export async function getJobDownloadUrl(jobId: string) {
  return apiFetch(`/api/v1/jobs/${jobId}/download-url`);
}

export async function downloadJobFile(jobId: string) {
  const data = await getJobDownloadUrl(jobId);

  if (!data.download_url) {
    throw new Error("Download URL is not available.");
  }

  window.open(data.download_url, "_blank", "noopener,noreferrer");
}
