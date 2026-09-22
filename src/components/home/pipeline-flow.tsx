"use client";

import { useReducedMotion } from "motion/react";
import type { ComponentType, RefAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIcon,
  EarthIcon,
  LockKeyholeIcon,
  RouteIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import { pipeline } from "./constants";

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };
type StageIconComponent = ComponentType<
  {
    "aria-hidden"?: boolean | "true" | "false";
    size?: number;
  } & RefAttributes<IconHandle>
>;

const stageIcons = [
  LockKeyholeIcon,
  ActivityIcon,
  EarthIcon,
  ShieldCheckIcon,
  RouteIcon,
] as StageIconComponent[];

const STEP_MS = 2200;

export function PipelineFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const iconRefs = useRef<(IconHandle | null)[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % pipeline.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  useEffect(() => {
    iconRefs.current[activeIndex]?.startAnimation();
    return () => iconRefs.current[activeIndex]?.stopAnimation();
  }, [activeIndex]);

  return (
    <div className="relative mt-12">
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {pipeline.map((item, index) => {
          const StageIcon = stageIcons[index];
          const active = index === activeIndex;
          return (
            <li
              key={item.stage}
              className={`relative rounded-2xl border p-5 backdrop-blur-sm transition duration-300 ${
                active
                  ? "border-pixie-green-500/50 bg-white shadow-[0_18px_45px_rgba(16,34,18,0.14)] dark:border-pixie-green-400/40 dark:bg-black/30"
                  : "border-pastel-green-900/10 bg-white/70 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(16,34,18,0.1)] dark:border-pastel-green-200/10 dark:bg-black/20"
              }`}
            >
              {active ? (
                <span className="absolute -top-2.5 left-5 rounded-full bg-pixie-green-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-pixie-green-400 dark:text-pastel-green-950">
                  Now inspecting
                </span>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tabular-nums text-pixie-green-600 dark:text-pixie-green-300">
                  {item.stage}
                </span>
                <span
                  className={`flex size-9 items-center justify-center rounded-full transition-colors duration-300 ${
                    active
                      ? "bg-pixie-green-600 text-white dark:bg-pixie-green-400 dark:text-pastel-green-950"
                      : "bg-pixie-green-100 text-pixie-green-700 dark:bg-pixie-green-900/40 dark:text-pixie-green-200"
                  }`}
                >
                  <StageIcon
                    aria-hidden="true"
                    size={18}
                    ref={(handle) => {
                      iconRefs.current[index] = handle;
                    }}
                  />
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-pastel-green-950 dark:text-pastel-green-50">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-pastel-green-900/65 dark:text-pastel-green-100/65">
                {item.detail}
              </p>
            </li>
          );
        })}
      </ol>

      <div
        aria-hidden="true"
        className="relative mt-5 hidden h-1 rounded-full bg-pastel-green-900/10 lg:block dark:bg-pastel-green-200/10"
      >
        <span
          className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-pixie-green-500 shadow-[0_0_0_4px_rgba(34,140,70,0.15)] transition-[left] duration-700 ease-out dark:bg-pixie-green-300"
          style={{
            left: `calc(${(activeIndex / (pipeline.length - 1)) * 100}% - 6px)`,
          }}
        />
      </div>
    </div>
  );
}
