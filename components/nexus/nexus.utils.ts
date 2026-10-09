import type { McpSection, Msg } from "./nexus.types";

export function safeParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function dedupeByFingerprint(list: Msg[]): Msg[] {
  const seen = new Set<string>();
  const out: Msg[] = [];

  for (const message of list) {
    const key =
      `${message.role}|${message.ts}|${message.text}`;

    if (seen.has(key)) continue;

    seen.add(key);
    out.push(message);
  }

  return out;
}

export function looksSensitive(text: string): boolean {
  const value = text.toLowerCase();

  return (
    value.includes("sk_live_") ||
    value.includes("sk_test_") ||
    value.includes("whsec_") ||
    value.includes("bearer ") ||
    value.includes("authorization:") ||
    value.includes("contraseña") ||
    value.includes("x-api-key") ||
    value.includes("password") ||
    value.includes("token") ||
    /\b\d{12,19}\b/.test(text.replace(/\s/g, ""))
  );
}

export function sectionsToPlainText(
  sections?: McpSection[],
): string {
  if (!Array.isArray(sections) || sections.length === 0) {
    return "";
  }

  return sections
    .map((section) => {
      if (section.type === "notice") {
        const badge = (section.kind ?? "info")
          .toString()
          .toUpperCase();

        return `${badge}: ${section.message ?? ""}${
          section.details
            ? `\n${section.details}`
            : ""
        }`.trim();
      }

      if (section.type === "kpi_grid") {
        const items = Array.isArray(section.items)
          ? section.items
          : [];

        const body = items
          .map((item) => {
            const label = String(
              item.label ?? "KPI",
            );

            const value =
              item.value === null ||
              item.value === undefined
                ? "—"
                : String(item.value);

            const unit = item.unit
              ? ` ${String(item.unit)}`
              : "";

            return `${label}: ${value}${unit}`;
          })
          .join("\n");

        return `${
          section.title
            ? `${section.title}\n`
            : ""
        }${body}`.trim();
      }

      if (section.type === "sparkline") {
        const items = Array.isArray(section.items)
          ? section.items
          : [];

        const body = items
          .map((item) => {
            const label = String(
              item.label ?? "Serie",
            );

            const points = Array.isArray(
              item.points,
            )
              ? item.points
              : [];

            const values = points
              .map((point) => Number(point?.v))
              .filter((value) =>
                Number.isFinite(value),
              );

            if (values.length < 2) {
              return `${label}: sin histórico suficiente`;
            }

            const first = values[0];
            const last =
              values[values.length - 1];

            const trend =
              last > first
                ? "alcista"
                : last < first
                  ? "bajista"
                  : "plana";

            return `${label}: tendencia ${trend}, último valor ${Number(
              last,
            ).toLocaleString()}`;
          })
          .join("\n");

        return `${
          section.title
            ? `${section.title}\n`
            : ""
        }${body}`.trim();
      }

      if (section.type === "text") {
        return `${
          section.title
            ? `${section.title}\n`
            : ""
        }${section.text ?? ""}`.trim();
      }

      return section.text ?? "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function buildSparkPath(
  values: number[],
  width: number,
  height: number,
): string {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x =
        (index /
          Math.max(values.length - 1, 1)) *
        width;

      const y =
        height -
        ((value - min) / range) * height;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(
        2,
      )} ${y.toFixed(2)}`;
    })
    .join(" ");
}