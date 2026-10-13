// Engraved ornaments for the field-notes theme. All drawn in currentColor
// with hairline strokes, so they take whatever faint ink the caller sets.

type Ring = {
  /** Base radius, in a 0..100 viewBox centred on 0. */
  r: number;
  /** Wave height. */
  amp: number;
  /** Waves per turn. */
  waves: number;
  /** Phase-shifted copies; more strands = denser interlace. */
  strands: number;
};

// Banknote-style guilloche: each ring is one wavy circle, repeated with a
// small rotation so the copies weave into a band.
const SEAL: Ring[] = [
  { r: 86, amp: 7, waves: 18, strands: 9 },
  { r: 62, amp: 9, waves: 12, strands: 8 },
  { r: 38, amp: 8, waves: 8, strands: 7 },
  { r: 16, amp: 6, waves: 6, strands: 6 },
];
const SMALL: Ring[] = [{ r: 70, amp: 22, waves: 6, strands: 3 }];

function wave({ r, amp, waves }: Ring) {
  const steps = Math.max(120, waves * 16);
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const rr = r + amp * Math.sin(waves * t);
    d += `${i ? "L" : "M"}${(rr * Math.cos(t)).toFixed(1)} ${(rr * Math.sin(t)).toFixed(1)}`;
  }
  return `${d}Z`;
}

export function Rosette({
  size = "seal",
  className,
}: {
  size?: "seal" | "small";
  className?: string;
}) {
  const rings = size === "seal" ? SEAL : SMALL;
  return (
    <svg
      aria-hidden="true"
      viewBox="-100 -100 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={size === "seal" ? 0.6 : 1.5}
      vectorEffect="non-scaling-stroke"
      className={className}
    >
      {size === "seal" ? (
        <>
          <circle r={97} />
          <circle r={94} />
        </>
      ) : null}
      {rings.map((ring) => {
        const d = wave(ring);
        const step = 360 / ring.waves / ring.strands;
        return Array.from({ length: ring.strands }, (_, s) => {
          const angle = (s * step).toFixed(2);
          return (
            <path
              key={`${ring.r}@${angle}`}
              d={d}
              transform={`rotate(${angle})`}
              vectorEffect="non-scaling-stroke"
            />
          );
        });
      })}
    </svg>
  );
}

/** Drafting dimension line: |◂──── label ────▸| */
export function DimensionLine({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center font-mono text-[11px] text-ink-soft ${className}`}
    >
      <span className="h-3 w-px bg-ink-soft/70" />
      <span className="-ml-px leading-none">◂</span>
      <span className="h-px flex-1 bg-ink-soft/50" />
      <span className="px-2 whitespace-nowrap">{label}</span>
      <span className="h-px flex-1 bg-ink-soft/50" />
      <span className="-mr-px leading-none">▸</span>
      <span className="h-3 w-px bg-ink-soft/70" />
    </div>
  );
}

/** Rubber stamp. Green only for things that passed a check. */
export function Stamp({
  children,
  tone = "ink",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "ink" | "accent";
  className?: string;
}) {
  const color =
    tone === "accent" ? "border-accent text-accent" : "border-ink text-ink";
  return (
    <span
      className={`inline-block rounded-[3px] border-2 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] opacity-80 ${color} ${className}`}
    >
      {children}
    </span>
  );
}

/** Full-width jaali band used as a section divider. */
export function JaaliDivider() {
  return (
    <div
      aria-hidden="true"
      className="jaali h-8 border-b border-rule bg-paper-2/60"
    />
  );
}
