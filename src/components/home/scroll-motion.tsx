"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/* Scroll-linked motion for the landing. Reduced motion is handled with
   motion-reduce:*! classes, which beat the inline styles without a
   server/client mismatch. */

/** Accent hairline across the top of the viewport, tracking page progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent"
    />
  );
}

/**
 * A rule that draws itself as it scrolls through the viewport. Position it
 * with className; the element's own box is the scroll target.
 */
export function ScrollRule({
  axis,
  offset,
  className,
}: {
  axis: "x" | "y";
  offset: Offset;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={
        axis === "x" ? { scaleX: scrollYProgress } : { scaleY: scrollYProgress }
      }
      className={`pointer-events-none absolute bg-accent motion-reduce:transform-none! ${axis === "x" ? "origin-left" : "origin-top"} ${className ?? ""}`}
    />
  );
}

/** Starts tipped back on the desk and lies flat by the time it is centered. */
export function TiltFigure({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  return (
    <motion.figure
      ref={ref}
      style={{ rotateX, scale, transformPerspective: 1200 }}
      className={`motion-reduce:transform-none! ${className ?? ""}`}
    >
      {children}
    </motion.figure>
  );
}

/** Heading whose words ink in one by one as it scrolls up the page. */
export function InkWords({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 50%"],
  });
  const words = text.split(" ");
  return (
    <span ref={ref}>
      {words.map((word, i) => (
        <Word
          // biome-ignore lint/suspicious/noArrayIndexKey: static text, words can repeat
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {i < words.length - 1 ? `${word} ` : word}
        </Word>
      ))}
    </span>
  );
}

function Word({
  progress,
  range,
  children,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="motion-reduce:opacity-100!">
      {children}
    </motion.span>
  );
}
