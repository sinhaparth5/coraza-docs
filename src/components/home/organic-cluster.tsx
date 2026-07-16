export function OrganicCluster({ position }: { position: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute hidden opacity-60 md:block ${
        position === "left" ? "-bottom-24 -left-20" : "-bottom-20 -right-16"
      }`}
      aria-hidden="true"
    >
      <div className="relative h-72 w-72">
        <div className="absolute left-0 top-4 size-28 rounded-full bg-gradient-to-b from-pastel-green-100 to-pastel-green-300" />
        <div className="absolute bottom-0 left-3 h-40 w-24 rounded-full bg-gradient-to-b from-pastel-green-200 to-pastel-green-500" />
        <div className="absolute right-2 top-20 size-32 rounded-full bg-gradient-to-b from-pastel-green-50 to-pastel-green-300" />
      </div>
    </div>
  );
}
