export function ConcentricRings({
  position,
  tone = "pixie-green",
  className = "",
}: {
  position: string;
  tone?: "pixie-green" | "sinbad";
  className?: string;
}) {
  const toneClass =
    tone === "sinbad"
      ? "text-sinbad-700/15 dark:text-sinbad-200/10"
      : "text-pixie-green-700/15 dark:text-pixie-green-200/10";

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute hidden sm:block ${position} ${toneClass} ${className}`}
      fill="none"
      height="420"
      viewBox="0 0 420 420"
      width="420"
    >
      <circle cx="210" cy="210" r="209" stroke="currentColor" />
      <circle cx="210" cy="210" r="150" stroke="currentColor" />
      <circle cx="210" cy="210" r="90" stroke="currentColor" />
    </svg>
  );
}

export function BlurBlob({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full blur-[130px] ${className}`}
    />
  );
}

export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px] ${className}`}
    />
  );
}

export function DiagonalStripes({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute [background-image:repeating-linear-gradient(115deg,currentColor_0,currentColor_1px,transparent_1px,transparent_18px)] ${className}`}
    />
  );
}
