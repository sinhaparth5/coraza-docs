"use client";

import { type RefObject, useEffect } from "react";

// Shared engine for the landing page's ASCII figures: sizing, theme colours,
// a pre-rolled first frame (also the reduced-motion frame), and pausing when
// the canvas is off screen or the tab is hidden. Scenes keep their own clock
// from the `dt` they are stepped with.

export const CELL_H = 18;
const FONT_SIZE = 13;
const STEP = 1 / 60;

export type Colors = {
  ink: string;
  soft: string;
  rule: string;
  accent: string;
  stamp: string;
  highlight: string;
};

export type Stage = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** Width of one monospace cell. */
  cw: number;
  colors: Colors;
};

export type Scene = {
  resize?(s: Stage): void;
  step(dt: number, s: Stage): void;
  draw(s: Stage): void;
};

function readColors(el: HTMLElement): Colors {
  const styles = getComputedStyle(el);
  const get = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;
  return {
    ink: get("--fn-ink", "#1f2a24"),
    soft: get("--fn-ink-soft", "#4a5a52"),
    rule: get("--fn-rule", "rgba(0,0,0,.15)"),
    accent: get("--fn-accent", "#2f7a4a"),
    stamp: get("--fn-stamp", "#c0392b"),
    highlight: get("--fn-highlight", "#f3e27a"),
  };
}

/** Draft-style 45° hatching inside a box: the page's symbol for "wall". */
export function hatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  gap = 8,
) {
  ctx.clearRect(x, y, w, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = -h; i < w; i += gap) {
    ctx.moveTo(x + i, y + h);
    ctx.lineTo(x + i + h, y);
  }
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = color;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

export function pad(n: number, size = 3) {
  return String(n).padStart(size, "0");
}

export function useAsciiCanvas(
  ref: RefObject<HTMLCanvasElement | null>,
  createScene: () => Scene,
  prerollSeconds = 4,
) {
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const font = `${FONT_SIZE}px ${getComputedStyle(canvas).getPropertyValue("--font-jetbrains-mono") || "monospace"}, ui-monospace, monospace`;
    const stage: Stage = {
      ctx,
      width: 0,
      height: 0,
      cw: 7.8,
      colors: readColors(canvas),
    };
    const scene = createScene();
    let frame = 0;
    let running = false;
    let last = 0;
    let inView = false;

    function resize() {
      if (!canvas) return;
      const { ctx } = stage;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      stage.width = rect.width;
      stage.height = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = font;
      stage.cw = ctx.measureText("M").width || stage.cw;
      scene.resize?.(stage);
    }

    function draw() {
      const { ctx } = stage;
      ctx.clearRect(0, 0, stage.width, stage.height);
      ctx.font = font;
      ctx.textBaseline = "middle";
      ctx.globalAlpha = 1;
      scene.draw(stage);
      ctx.globalAlpha = 1;
    }

    function loop(now: number) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      scene.step(dt, stage);
      draw();
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    resize();
    // Pre-roll so the first paint (and the reduced-motion static frame)
    // already shows the scene mid-story instead of an empty canvas.
    for (let t = 0; t < prerollSeconds; t += STEP) scene.step(STEP, stage);
    draw();

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    });
    visibility.observe(canvas);

    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);

    const theme = new MutationObserver(() => {
      stage.colors = readColors(canvas);
      draw();
    });
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (inView) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      visibility.disconnect();
      theme.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref, createScene, prerollSeconds]);
}
