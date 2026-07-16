"use client";

import type { HTMLMotionProps, Transition, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import type { MouseEvent } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/cn";

export interface RouteIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface RouteIconProps extends HTMLMotionProps<"div"> {
  size?: number;
}

const circleTransition: Transition = {
  duration: 0.3,
  delay: 0.1,
  opacity: { delay: 0.15 },
};

const circleVariants: Variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: { pathLength: [0, 1], opacity: [0, 1] },
};

const pathVariants: Variants = {
  normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
  animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0] },
};

export const RouteIcon = forwardRef<RouteIconHandle, RouteIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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
          <motion.circle
            animate={controls}
            cx="6"
            cy="19"
            r="3"
            transition={circleTransition}
            variants={circleVariants}
          />
          <motion.path
            animate={controls}
            d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"
            transition={{
              duration: 0.7,
              delay: 0.5,
              opacity: { delay: 0.5 },
            }}
            variants={pathVariants}
          />
          <motion.circle
            animate={controls}
            cx="18"
            cy="5"
            r="3"
            transition={circleTransition}
            variants={circleVariants}
          />
        </svg>
      </motion.div>
    );
  },
);

RouteIcon.displayName = "RouteIcon";
