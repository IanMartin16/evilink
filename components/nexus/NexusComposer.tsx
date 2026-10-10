// NexusComposer.tsx
"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

import { EVILINK } from "./nexus.constants";

type NexusComposerProps = {
  value: string;
  canSend: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;

  onChange: (value: string) => void;
  onSend: () => void;
};

export function NexusComposer({
  value,
  canSend,
  inputRef,
  onChange,
  onSend,
}: NexusComposerProps) {
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height =
      Math.min(el.scrollHeight, 96) + "px";
  }, [value, inputRef]);

  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        padding: 12,
        borderTop:
          "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey
          ) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Enter para enviar · Shift+Enter para salto de línea"
        rows={2}
        style={{
          width: "100%",
          resize: "none",
          padding: 10,
          borderRadius: 12,
          background:
            "rgba(255,255,255,0.04)",
          border:
            `1px solid ${EVILINK.border}`,
          color: EVILINK.text,
          outline: "none",
          boxShadow:
            "0 0 0 0 transparent",
          lineHeight: 1.3,
          fontSize: 14,
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            opacity: 0.75,
            lineHeight: 1.2,
          }}
        >
          ⚠️ No pegues passwords, tokens,
          llaves API o datos bancarios.
        </span>

        <button
          onClick={onSend}
          disabled={!canSend}
          style={{
            opacity: canSend ? 1 : 0.5,
            cursor: canSend
              ? "pointer"
              : "not-allowed",
            padding: "10px 14px",
            borderRadius: 12,
            background: EVILINK.accent,
            color: "#06110A",
            border:
              "1px solid rgba(0,0,0,0.18)",
            boxShadow:
              `0 0 12px ${EVILINK.accent}55`,
            fontWeight: 700,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}