"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

export function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    if (!navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors duration-200 hover:border-white/20 sm:flex-row sm:items-start sm:p-5">
      <code className="min-w-0 whitespace-pre-wrap break-all bg-transparent p-0 font-mono text-[0.8125rem] leading-7 text-white/90 sm:break-words sm:text-sm">
        <span className="select-none text-pastel-green-300">$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-xs font-semibold text-white/80 transition duration-200 hover:border-white/30 hover:bg-white/15 hover:text-white active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pastel-green-300"
        aria-label={
          copied ? "Copied to clipboard" : "Copy command to clipboard"
        }
      >
        {copied ? (
          <CheckIcon
            aria-hidden="true"
            className="size-4 text-pastel-green-300"
            size={16}
          />
        ) : (
          <CopyIcon aria-hidden="true" className="size-4" size={16} />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Command copied to clipboard" : ""}
      </span>
    </div>
  );
}
