// src/components/data-link/ProcessFileCard.tsx

"use client";

import { FormEvent, useState, useEffect } from "react";

type ProcessFileCardProps = {
  dashboard: any;
  onProcess: (payload: {
    file: File;
    format: string;
    preset: string;
    filterField?: string;
    filterValue?: string;
    filterOperator?: string;
  }) => Promise<void>;
};

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

function getFileSizeMb(file: File) {
  return file.size / 1024 / 1024;
}

export function ProcessFileCard({ dashboard, onProcess }: ProcessFileCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("csv");
  const [preset, setPreset] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterOperator, setFilterOperator] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const customFiltersAllowed = dashboard.limits.custom_filters_allowed;
  const maxFileSizeMb = dashboard.limits.max_file_size_mb;
  const maxRecords = dashboard.limits.max_records_per_file;
  const plan = dashboard.user.plan;
  const presets = dashboard.presets || [];

  const isDedupeByField = preset === "REMOVE_DUPLICATES_BY_FIELD";

  useEffect(() => {
    const firstAvailablePreset = presets.find((item: any) => item.available);

    if (firstAvailablePreset && !preset) {
      setPreset(firstAvailablePreset.value);
    }
  }, [presets, preset]);

  useEffect(() => {
    // Cuando el usuario cambia a dedupe por campo, evitamos mandar
    // operador/valor como si fuera custom filter.
    if (isDedupeByField) {
      setFilterOperator("");
      setFilterValue("");
    }
  }, [isDedupeByField]);

  function handlePresetChange(value: string) {
    setPreset(value);
    setError("");

    // Limpiamos campos para evitar mezclar modos.
    setFilterField("");
    setFilterOperator("");
    setFilterValue("");
  }

  function handleFileChange(selectedFile: File | null) {
    setError("");
    setFile(selectedFile);

    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const fileSizeMb = getFileSizeMb(selectedFile);

    if (fileName.endsWith(".csv")) {
      setFormat("csv");
    } else if (fileName.endsWith(".json")) {
      setFormat("json");
    } else {
      setError("Only CSV and JSON files are supported.");
      return;
    }

    if (fileSizeMb > maxFileSizeMb) {
      setError(
        `File exceeds your ${plan} plan limit. Max size: ${maxFileSizeMb} MB.`
      );
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Choose a CSV or JSON file.");
      return;
    }

    const fileSizeMb = getFileSizeMb(file);

    if (fileSizeMb > maxFileSizeMb) {
      setError(
        `File exceeds your ${plan} plan limit. Max size: ${maxFileSizeMb} MB.`
      );
      return;
    }

    if (!preset) {
      setError("Choose an operation preset.");
      return;
    }

    const selectedPreset = presets.find((item: any) => item.value === preset);

    if (selectedPreset && !selectedPreset.available) {
      setError(
        selectedPreset.locked_message || "This preset is available on STARTER."
      );
      return;
    }

    if (isDedupeByField && !filterField.trim()) {
      setError("Choose the field to deduplicate by.");
      return;
    }

    const hasCustomFilter =
      Boolean(filterField.trim()) ||
      Boolean(filterOperator.trim()) ||
      Boolean(filterValue.trim());

    if (!isDedupeByField && hasCustomFilter && !customFiltersAllowed) {
      setError("Custom filters are available on STARTER.");
      return;
    }

    if (!isDedupeByField && hasCustomFilter) {
      if (!filterField.trim() || !filterOperator.trim() || !filterValue.trim()) {
        setError("Custom filters require field, operator and value.");
        return;
      }
    }

    try {
      setLoading(true);

      await onProcess({
        file,
        format,
        preset,
        filterField: filterField.trim() || undefined,
        filterOperator: isDedupeByField
          ? undefined
          : filterOperator.trim() || undefined,
        filterValue: isDedupeByField
          ? undefined
          : filterValue.trim() || undefined,
      });

      setFile(null);
    } catch (err: any) {
      setError(err.message || "Could not process file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="dl-panel">
      <div className="dl-panel-header">
        <div>
          <h2>Process file</h2>
          <p>Upload a CSV or JSON file and clean your data.</p>
        </div>
      </div>

      <div className="dl-plan-note">
        <strong>{plan}</strong>
        <span>
          Up to {maxFileSizeMb} MB per file · {formatNumber(maxRecords)} records
          per file
        </span>
      </div>

      <form onSubmit={handleSubmit} className="dl-process-form">
        <label>File</label>

        <label className="dl-upload-box">
          <input
            type="file"
            accept=".csv,.json"
            onChange={(event) =>
              handleFileChange(event.target.files?.[0] || null)
            }
          />

          <span className="dl-upload-title">
            {file ? file.name : "Choose a CSV or JSON file"}
          </span>

          <small>
            {file
              ? `${getFileSizeMb(file).toFixed(2)} MB · detected as ${format.toUpperCase()}`
              : "Data_Link will detect the file format automatically."}
          </small>
        </label>

        <div className="dl-form-row">
          <div>
            <label>Format</label>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value)}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label>Operation</label>
            <select
              value={preset}
              onChange={(event) => handlePresetChange(event.target.value)}
            >
              <option value="" disabled>
                Choose operation
              </option>

              {presets.map((item: any) => (
                <option
                  key={item.value}
                  value={item.value}
                  disabled={!item.available}
                >
                  {item.display_name}
                  {!item.available ? " — STARTER" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isDedupeByField ? (
          <div className="dl-filter-box">
            <div className="dl-filter-title">
              <span>Field to deduplicate by</span>
              <small>Required</small>
            </div>

            <input
              placeholder="Example: material, sku, customer_id"
              value={filterField}
              onChange={(event) => setFilterField(event.target.value)}
            />

            <small className="dl-field-hint">
              Data_Link will remove duplicate records using this field as the
              deduplication key.
            </small>
          </div>
        ) : (
          <div className="dl-filter-box">
            <div className="dl-filter-title">
              <span>Custom filters</span>
              {!customFiltersAllowed && <small>Available on STARTER</small>}
            </div>

            <div className="dl-form-row dl-filter-row">
              <input
                placeholder="Field"
                value={filterField}
                disabled={!customFiltersAllowed}
                onChange={(event) => setFilterField(event.target.value)}
              />

              <select
                value={filterOperator}
                disabled={!customFiltersAllowed}
                onChange={(event) => setFilterOperator(event.target.value)}
              >
                <option value="">Operator</option>
                <option value="EQUALS">Equals</option>
                <option value="NOT_EQUALS">Not equals</option>
                <option value="CONTAINS">Contains</option>
                <option value="GREATER_THAN">Greater than</option>
                <option value="LESS_THAN">Less than</option>
              </select>

              <input
                placeholder="Value"
                value={filterValue}
                disabled={!customFiltersAllowed}
                onChange={(event) => setFilterValue(event.target.value)}
              />
            </div>
          </div>
        )}

        {error && <div className="dl-error">{error}</div>}

        <button type="submit" className="dl-primary-btn" disabled={loading}>
          {loading ? "Creating job..." : "Process file"}
        </button>
      </form>
    </section>
  );
}