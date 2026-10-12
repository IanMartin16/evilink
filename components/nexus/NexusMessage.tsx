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

function ResponseDetails({
  message,
}: {
  message: Msg;
}) {
  const toolResults = Array.isArray(message.toolResults)
    ? message.toolResults
    : [];

  const hasDetails =
    Boolean(message.traceId) ||
    toolResults.length > 0;

  if (!hasDetails) return null;

  return (
    <details className={styles.responseDetails}>
      <summary className={styles.responseDetailsSummary}>
        <span>Details</span>
        <span className={styles.responseDetailsChevron}>
          ▾
        </span>
      </summary>

      <div className={styles.responseDetailsBody}>
        {message.traceId && (
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>
              Trace ID
            </span>

            <code className={styles.traceValue}>
              {message.traceId}
            </code>
          </div>
        )}

        {toolResults.map((result: any, index) => (
          <div
            key={index}
            className={styles.toolMeta}
          >
            <div className={styles.toolMetaHeader}>
              <strong>
                {result.tool ??
                  result.toolCallId ??
                  "tool"}
              </strong>

              <span
                className={
                  result.ok
                    ? styles.toolOk
                    : styles.toolError
                }
              >
                {result.ok ? "OK" : "ERROR"}
              </span>
            </div>

            <div className={styles.toolMetaGrid}>
              {result.latencyMs !== undefined && (
                <span>
                  latency · {result.latencyMs} ms
                </span>
              )}

              {result.source && (
                <span>
                  source · {String(result.source)}
                </span>
              )}

              {result.provider && (
                <span>
                  provider · {String(result.provider)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </details>
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
        <div className={styles.narrative}>
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
        <ResponseDetails message={message} />
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