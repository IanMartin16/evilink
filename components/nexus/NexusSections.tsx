import type {
  McpPoint,
  McpSection,
} from "./nexus.types";

import { EVILINK } from "./nexus.constants";
import { buildSparkPath } from "./nexus.utils";
import { NexusMarkdown } from "./NexusMarkdown";

function SparkMini({
  points,
}: {
  points: McpPoint[];
}) {
  const values = points
    .map((point) => Number(point?.v))
    .filter((value) => Number.isFinite(value));

  if (values.length < 2) {
    return (
      <div
        style={{
          fontSize: 11,
          opacity: 0.65,
        }}
      >
        Sin histórico suficiente
      </div>
    );
  }

  const width = 180;
  const height = 30;

  const path = buildSparkPath(
    values,
    width,
    height,
  );

  const first = values[0];
  const last = values[values.length - 1];

  const up = last >= first;

  const stroke = up
    ? "#2BFF88"
    : "#FF6B6B";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="42"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
    const items = Array.isArray(
      section.items,
    )
      ? section.items
      : [];

    const cols =
      items.length === 1
        ? "1fr"
        : items.length === 2
          ? "repeat(2, minmax(0, 1fr))"
          : items.length === 3
            ? "repeat(3, minmax(0, 1fr))"
            : "repeat(2, minmax(0, 1fr))";

    return (
      <div
        style={{
          display: "grid",
          gap: 8,
        }}
      >
        {section.title && (
          <div
            style={{
              fontWeight: 900,
              fontSize: 12,
              opacity: 0.9,
            }}
          >
            {section.title}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 10,
          }}
        >
          {items.map((item, idx) => {
            const tone = String(
              item.tone ?? "",
            ).toLowerCase();

            const toneColor =
              tone === "up"
                ? "#2BFF88"
                : tone === "down"
                  ? "#FF6B6B"
                  : EVILINK.text;

            return (
              <div
                key={idx}
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border:
                    `1px solid ${EVILINK.border}`,
                  background:
                    "rgba(255,255,255,0.06)",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.22)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.75,
                  }}
                >
                  {String(
                    item.label ?? "KPI",
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: toneColor,
                    }}
                  >
                    {item.value === null ||
                    item.value === undefined
                      ? "—"
                      : String(item.value)}
                  </div>

                  {item.unit ? (
                    <div
                      style={{
                        fontSize: 11,
                        opacity: 0.75,
                        color: toneColor,
                      }}
                    >
                      {String(item.unit)}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (section.type === "sparkline") {
    const items = Array.isArray(
      section.items,
    )
      ? section.items
      : [];

    return (
      <div
        style={{
          display: "grid",
          gap: 8,
        }}
      >
        {section.title && (
          <div
            style={{
              fontWeight: 900,
              fontSize: 12,
              opacity: 0.9,
            }}
          >
            {section.title}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {items.map((item, idx) => {
            const points = Array.isArray(
              item.points,
            )
              ? item.points
              : [];

            const values = points
              .map((point) =>
                Number(point?.v),
              )
              .filter((value) =>
                Number.isFinite(value),
              );

            const last = values.length
              ? values[values.length - 1]
              : null;

            const first = values.length
              ? values[0]
              : null;

            const up =
              last !== null &&
              first !== null
                ? last >= first
                : null;

            return (
              <div
                key={idx}
                style={{
                  padding: "8px 10px",
                  borderRadius: 14,
                  border:
                    `1px solid ${EVILINK.border}`,
                  background:
                    "rgba(255,255,255,0.05)",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.18)",
                  display: "grid",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.72,
                    }}
                  >
                    {String(
                      item.label ?? "Serie",
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      color:
                        up === null
                          ? EVILINK.text
                          : up
                            ? "#2BFF88"
                            : "#FF6B6B",
                    }}
                  >
                    {last === null
                      ? "N/D"
                      : Number(
                          last,
                        ).toLocaleString()}
                  </div>
                </div>

                <SparkMini points={points} />
              </div>
            );
          })}
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