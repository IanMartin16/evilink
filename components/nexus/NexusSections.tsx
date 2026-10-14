import type {
  McpPoint,
  McpSection,
} from "./nexus.types";

import { EVILINK } from "./nexus.constants";
import { buildSparkPath } from "./nexus.utils";
import { NexusMarkdown } from "./NexusMarkdown";
import styles from "./nexusWidget.module.css";

function SparkMini({
  label,
  value,
  unit,
  points,
  tone = "neutral",
}: {
  label: string;
  value?: string | number | null;
  unit?: string;
  points: Array<{
    t?: string | null;
    v: number;
  }>;
  tone?: "up" | "down" | "neutral";
}) {
  const cleanPoints = points.filter(
    (point) =>
      point &&
      Number.isFinite(point.v)
  );

  if (cleanPoints.length < 2) {
    return null;
  }

  const values = cleanPoints.map(
    (point) => point.v
  );

  const first = values[0];
  const last = values[values.length - 1];

  const min = Math.min(...values);
  const max = Math.max(...values);

  const changePct =
    sparkChangePct(cleanPoints);

  const resolvedTone =
    tone !== "neutral"
      ? tone
      : last > first
      ? "up"
      : last < first
      ? "down"
      : "neutral";

  const path = buildSparkPath(
    values,
    100,
    34
  );

  const displayValue =
    typeof value === "string"
      ? value
      : formatSparkValue(
          typeof value === "number"
            ? value
            : last,
          unit
        );

  const changeLabel =
    `${changePct >= 0 ? "+" : ""}` +
    `${changePct.toFixed(2)}%`;

  return (
    <article
      className={styles.sparkCard}
      data-tone={resolvedTone}
    >
      <div className={styles.sparkHeader}>
        <div>
          <div className={styles.sparkSymbol}>
            {label}
          </div>

          <div className={styles.sparkWindow}>
            RECENT
          </div>
        </div>

        <div className={styles.sparkReading}>
          <div className={styles.sparkValue}>
            {displayValue}
          </div>

          <div className={styles.sparkChange}>
            {changeLabel}
          </div>
        </div>
      </div>

      <div className={styles.sparkChart}>
        <svg
          viewBox="0 0 100 34"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${label} recent price movement`}
        >
          <path
            className={styles.sparkGhost}
            d={path}
          />

          <path
            className={styles.sparkLine}
            d={path}
          />
        </svg>
      </div>

      <div className={styles.sparkRange}>
        <span>
          Low{" "}
          <strong>
            {formatSparkValue(min, unit)}
          </strong>
        </span>

        <span>
          High{" "}
          <strong>
            {formatSparkValue(max, unit)}
          </strong>
        </span>
      </div>
    </article>
  );
}

function formatSparkValue(value: number, unit = "USD") {
  if (!Number.isFinite(value)) return "—";

  const abs = Math.abs(value);

  let maximumFractionDigits = 2;

  if (abs < 1) maximumFractionDigits = 6;
  if (abs < 0.01) maximumFractionDigits = 8;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);

  return unit === "USD"
    ? `$${formatted}`
    : `${formatted} ${unit}`;
}

function sparkChangePct(points: Array<{ t?: string | null; v: number }>) {
  if (points.length < 2) return 0;

  const first = points[0]?.v;
  const last = points[points.length - 1]?.v;

  if (
    !Number.isFinite(first) ||
    !Number.isFinite(last) ||
    first === 0
  ) {
    return 0;
  }

  return ((last - first) / first) * 100;
}

export function NexusSection({
  section,
}: {
  section: McpSection;
}) {
  if (section.type === "notice") {
    const kind = (
      section.kind ?? "info"
    ).toLowerCase();

    const isWarn = kind === "warning";
    const isErr = kind === "error";

    const background = isErr
      ? "rgba(255, 80, 80, 0.12)"
      : isWarn
        ? "rgba(255, 180, 0, 0.12)"
        : "rgba(0, 229, 255, 0.10)";

    const badge = isErr
      ? "ERROR"
      : isWarn
        ? "WARN"
        : "INFO";

    return (
      <div
        style={{
          padding: "8px 10px",
          borderRadius: 14,
          border: `1px solid ${EVILINK.border}`,
          background,
          fontSize: 11,
          lineHeight: 1.35,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 0.6,
              padding: "2px 8px",
              borderRadius: 999,
              background:
                "rgba(255,255,255,0.10)",
              border:
                `1px solid ${EVILINK.border}`,
            }}
          >
            {badge}
          </span>

          <div style={{ fontWeight: 900 }}>
            {section.message ?? "Notice"}
          </div>
        </div>

        {section.details && (
          <div
            style={{
              opacity: 0.8,
              marginTop: 6,
            }}
          >
            {section.details}
          </div>
        )}
      </div>
    );
  }

  if (section.type === "kpi_grid") {
  const items = Array.isArray(section.items)
    ? section.items
    : [];

  return (
    <div className={styles.kpiSection}>
      {section.title && (
        <div className={styles.kpiTitle}>
          {section.title}
        </div>
      )}

      <div
        className={styles.kpiGrid}
        data-count={items.length}
      >
        {items.map((item, idx) => {
          const tone = String(
            item.tone ?? ""
          ).toLowerCase();

          return (
            <div
              key={idx}
              className={styles.kpiCard}
            >
              <span className={styles.kpiLabel}>
                {String(item.label ?? "KPI")}
              </span>

              <div className={styles.kpiReading}>
                <strong
                  className={styles.kpiValue}
                  data-tone={tone || "neutral"}
                >
                  {item.value == null
                    ? "—"
                    : String(item.value)}
                </strong>

                {item.unit && (
                  <span
                    className={styles.kpiUnit}
                    data-tone={tone || "neutral"}
                  >
                    {String(item.unit)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

  if (section.type === "sparkline") {
  const items = Array.isArray(section.items)
    ? section.items
    : [];

  return (
    <div className={styles.sectionBlock}>
      {section.title && (
        <div className={styles.sectionTitle}>
          {section.title}
        </div>
      )}

      <div className={styles.sparkGrid}>
        {items.map((item, idx) => (
          <SparkMini
            key={item.label ?? idx}
            label={String(item.label ?? "Serie")}
            value={item.value}
            unit={item.unit}
            tone={
              item.tone === "up" || item.tone === "down"
              ? item.tone
              : "neutral"
            }
            points={(Array.isArray(item.points) ? item.points : []).flatMap(
              (point) =>
              typeof point?.v === "number" &&
              Number.isFinite(point.v)
                ? [{ t: point.t ?? null, v: point.v }]
                : []
            )}
          />
        ))}
      </div>
    </div>
  );
}

  if (section.type === "text") {
    return (
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 14,
          border:
            `1px solid ${EVILINK.border}`,
          background:
            "rgba(255,255,255,0.04)",
        }}
      >
        {section.title && (
          <div
            style={{
              fontWeight: 900,
              marginBottom: 6,
            }}
          >
            {section.title}
          </div>
        )}

        <NexusMarkdown
          text={section.text ?? ""}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 14,
        border:
          `1px solid ${EVILINK.border}`,
        background:
          "rgba(255,255,255,0.03)",
        fontSize: 12,
        opacity: 0.85,
      }}
    >
      <div style={{ fontWeight: 900 }}>
        {section.title ?? section.type}
      </div>

      {section.text ? (
        <div style={{ marginTop: 6 }}>
          <NexusMarkdown
            text={section.text}
          />
        </div>
      ) : null}
    </div>
  );
}