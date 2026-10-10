// NexusComposer.tsx
"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

import { EVILINK } from "./nexus.constants";
import styles from "./nexusWidget.module.css";

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
    <div className={`${styles.shell} ${styles.composer}`}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Enter para enviar · Shift+Enter para salto de línea"
        rows={2}
        className={styles.composerInput}
      />

      <div className={styles.composerFooter}>
        <span className={styles.securityHint}>
          ⚠️ No pegues passwords, tokens,
          llaves API o datos bancarios.
        </span>

        <button
          onClick={onSend}
          disabled={!canSend}
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
}