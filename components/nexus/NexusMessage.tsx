"use client";

import type { Msg } from "./nexus.types";

import { EVILINK } from "./nexus.constants";
import { NexusMarkdown } from "./NexusMarkdown";
import { NexusSection } from "./NexusSections";
import { sectionsToPlainText } from "./nexus.utils";
import styles from "./nexusWidget.module.css";

type NexusMessageProps = {
  message: Msg;
  devMode: boolean;
  copied: boolean;
  onCopy: (id: string, text: string) => void;
};

function DevMeta({ message }: { message: Msg }) {
  const toolResults = Array.isArray(message.toolResults)
    ? message.toolResults
    : [];

  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 14,
        border: `1px solid ${EVILINK.border}`,
        background: "rgba(255,255,255,0.04)",
        display: "grid",
        gap: 10,
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: 12,
          opacity: 0.9,
        }}
      >
        Dev
      </div>

      <div
        style={{
          padding: "8px 10px",
          borderRadius: 12,
          border: `1px solid ${EVILINK.border}`,
          background: "rgba(255,255,255,0.05)",
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            opacity: 0.7,
          }}
        >
          Trace ID
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            overflowWrap: "anywhere",
          }}
        >
          {message.traceId ?? "—"}
        </div>
      </div>

      {toolResults.map((result: any, index) => (
        <div
          key={index}
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            border: `1px solid ${EVILINK.border}`,
            background: "rgba(255,255,255,0.05)",
            display: "grid",
            gap: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {result.tool ??
                result.toolCallId ??
                "tool"}
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: result.ok
                  ? "#2BFF88"
                  : "#FF6B6B",
              }}
            >
              {result.ok ? "OK" : "ERROR"}
            </div>
          </div>

          <div
            style={{
              fontSize: 11,
              opacity: 0.75,
            }}
          >
            latency: {result.latencyMs ?? "—"} ms
          </div>

          {result.source && (
            <div
              style={{
                fontSize: 11,
                opacity: 0.75,
              }}
            >
              source: {String(result.source)}
            </div>
          )}

          {result.provider && (
            <div
              style={{
                fontSize: 11,
                opacity: 0.75,
              }}
            >
              provider: {String(result.provider)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AssistantMessage({
  message,
  devMode,
}: {
  message: Msg;
  devMode: boolean;
}) {
  const sections = Array.isArray(message.sections)
    ? message.sections
    : [];

  const narrative =
    typeof message.text === "string" &&
    message.text.trim() &&
    message.text.trim() !== "(sin respuesta)"
      ? message.text
      : "";

  const headerNotices = sections.filter(
    (section) => section.type === "notice",
  );

  const bodySections = sections.filter(
    (section) => section.type !== "notice",
  );

  const hasAnySection = sections.length > 0;

  return (
    <div
      style={{
        display: "grid",
        gap: 10,
      }}
    >
      {headerNotices.map((section) => (
        <NexusSection
          key={section.id}
          section={section}
        />
      ))}

      {narrative ? (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            border: `1px solid ${EVILINK.border}`,
            background: "rgba(255,255,255,0.04)",
            fontSize: 14,
            lineHeight: 1.45,
          }}
        >
          <NexusMarkdown text={narrative} />
        </div>
      ) : null}

      {bodySections.map((section) => (
        <NexusSection
          key={section.id}
          section={section}
        />
      ))}

      {!hasAnySection && !narrative ? (
        <NexusMarkdown text={message.text} />
      ) : null}

      {devMode ? (
        <DevMeta message={message} />
      ) : null}
    </div>
  );
}

export function NexusMessage({
  message,
  devMode,
  copied,
  onCopy,
}: NexusMessageProps) {
  const copyPayload =
    Array.isArray(message.sections) &&
    message.sections.length
      ? sectionsToPlainText(message.sections)
      : message.text;

  const isUser = message.role === "user";

return (
  <div
    className={[
      styles.message,
      isUser
        ? styles.messageUser
        : styles.messageAssistant,
    ].join(" ")}
  >
    <div
      className={[
        styles.messageBubble,
        isUser
          ? styles.messageBubbleUser
          : styles.messageBubbleAssistant,
      ].join(" ")}
    >
      {message.role === "assistant" ? (
        <AssistantMessage
          message={message}
          devMode={devMode}
        />
      ) : (
        <NexusMarkdown text={message.text} />
      )}
    </div>

    {message.role === "assistant" && (
      <div className={styles.messageActions}>
        <button
          onClick={() =>
            onCopy(
              message.id,
              copyPayload,
            )
          }
          className={styles.copyButton}
          title="Copiar respuesta"
          aria-label="Copiar respuesta"
        >
          {copied
            ? "✅ Copied"
            : "📋 Copy"}
        </button>
      </div>
    )}
  </div>
);
}