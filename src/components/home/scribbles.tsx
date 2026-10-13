// Hand-drawn marks used sparingly on the landing page. Paths are deliberately
// a little uneven so they read as pen strokes rather than icons.

const paths = {
  "arrow-down": "M4 3c6 1 13 4 17 11m0 0c-3-1-6-1-8 0m8 0c0-3 0-6-1-8",
  "arrow-right": "M2 14c9-6 22-8 34-3m0 0c-3-2-5-5-6-7m6 7c-3 1-6 3-7 6",
  underline: "M2 8c18-5 40-6 60-3 10 1.5 20 3 34 1",
  circle: "M50 6C24 4 4 12 5 24s22 20 47 19 44-9 43-21C94 9 70 2 44 6",
} as const;

const viewBoxes: Record<keyof typeof paths, string> = {
  "arrow-down": "0 0 24 18",
  "arrow-right": "0 0 40 24",
  underline: "0 0 100 12",
  circle: "0 0 100 48",
};

export function Scribble({
  kind,
  className = "",
}: {
  kind: keyof typeof paths;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox={viewBoxes[kind]}
    >
      <path
        d={paths[kind]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
