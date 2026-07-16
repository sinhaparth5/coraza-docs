"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import type { MouseEvent } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/cn";

export interface ShieldCheckIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ShieldCheckIconProps extends HTMLMotionProps<"div"> {
  size?: number;
}

const pathVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    scale: 1,
    transition: { duration: 0.3, opacity: { duration: 0.1 } },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    scale: [0.5, 1],
    transition: { duration: 0.4, opacity: { duration: 0.1 } },
  },
};

export const ShieldCheckIcon = forwardRef<
  ShieldCheckIconHandle,
  ShieldCheckIconProps
>(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;
    return {
      startAnimation: () =>
        controls.start(shouldReduceMotion ? "normal" : "animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) onMouseEnter?.(event);
      else if (!shouldReduceMotion) controls.start("animate");
    },
    [controls, onMouseEnter, shouldReduceMotion],
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) onMouseLeave?.(event);
      else controls.start("normal");
    },
    [controls, onMouseLeave],
  );

  return (
    <motion.div
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <svg
        aria-hidden="true"
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <motion.path
          animate={controls}
          d="m9 12 2 2 4-4"
          initial="normal"
          variants={pathVariants}
        />
      </svg>
    </motion.div>
  );
});

ShieldCheckIcon.displayName = "ShieldCheckIcon";
