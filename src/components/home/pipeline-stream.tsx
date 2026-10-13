"use client";

import { useRef } from "react";
import { CELL_H, hatch, pad, type Scene, useAsciiCanvas } from "./ascii-canvas";

// The five checks from the pipeline list, as five hatched gates on one
// track. Each request is stopped at the gate that would really stop it, with
// that gate's verdict stamped beside it; survivors get routed to a backend.

const GATES = [
  { label: "bot", stamp: "[pow]" },
  { label: "rate", stamp: "[429]" },
  { label: "geo", stamp: "[geo]" },
  { label: "waf", stamp: "[403]" },
  { label: "route", stamp: "" },
];
// Chance a request is stopped at each gate; the rest are routed.
const STOP_ODDS = [0.12, 0.13, 0.1, 0.2];
const METHODS = ["GET", "GET", "GET", "POST", "PUT"];
const ROUTES = ["→api", "→www", "→blog"];

type Packet = {
  row: number;
  x: number;
  text: string;
  stopAt: number;
  route: string;
  speed: number;
};

function createScene(): Scene {
  let rows = 0;
  let gateX: number[] = [];
  // Phones get thinner gates and bracketless stamps so a request and its
  // verdict fit in the gap between two gates.
  let narrow = false;
  let GATE_W = 16;
  let packets: Packet[] = [];
  let stamps: { x: number; y: number; text: string; life: number }[] = [];
  const counts = [0, 0, 0, 0, 0];
  let sinceSpawn = 0;
  const rowY = (r: number) => CELL_H * 2 + r * CELL_H * 1.5;

  return {
    resize({ width, height }) {
      rows = Math.max(3, Math.floor((height - CELL_H * 3) / (CELL_H * 1.5)));
      narrow = width < 520;
      GATE_W = narrow ? 10 : 16;
      gateX = GATES.map((_, i) =>
        Math.round(width * (narrow ? 0.1 + i * 0.16 : 0.15 + i * 0.165)),
      );
    },

    step(dt, { width, cw }) {
      sinceSpawn += dt;
      if (sinceSpawn > 0.9 && packets.length < rows * 2) {
        sinceSpawn = 0;
        let roll = Math.random();
        let stopAt = -1;
        for (let i = 0; i < STOP_ODDS.length; i++) {
          if (roll < STOP_ODDS[i]) {
            stopAt = i;
            break;
          }
          roll -= STOP_ODDS[i];
        }
        const used = new Set(
          packets.filter((p) => p.x < gateX[0] - cw * 6).map((p) => p.row),
        );
        let row = Math.floor(Math.random() * rows);
        for (let i = 0; i < rows && used.has(row); i++) row = (row + 1) % rows;
        const text = METHODS[Math.floor(Math.random() * METHODS.length)];
        if (!used.has(row)) {
          packets.push({
            row,
            x: -text.length * cw,
            text,
            stopAt,
            route: ROUTES[Math.floor(Math.random() * ROUTES.length)],
            speed: 50 + Math.random() * 25,
          });
        }
      }

      const next: Packet[] = [];
      for (const p of packets) {
        p.x += p.speed * dt;
        if (p.stopAt >= 0 && p.x + p.text.length * cw >= gateX[p.stopAt]) {
          counts[p.stopAt]++;
          const text = narrow
            ? GATES[p.stopAt].stamp.slice(1, -1)
            : GATES[p.stopAt].stamp;
          stamps.push({
            x: gateX[p.stopAt] - cw * (text.length + 0.5),
            y: rowY(p.row),
            text,
            life: 1,
          });
          continue;
        }
        if (p.stopAt < 0 && p.x > gateX[4] + GATE_W) p.text = p.route;
        if (p.x > width) counts[4]++;
        else next.push(p);
      }
      packets = next;

      for (const st of stamps) st.life -= dt * 0.55;
      stamps = stamps.filter((st) => st.life > 0);
    },

    draw({ ctx, width, height, cw, colors }) {
      ctx.fillStyle = colors.rule;
      for (let r = 0; r < rows; r++) {
        for (let x = 0; x < width; x += cw * 3) ctx.fillText("·", x, rowY(r));
      }

      for (const p of packets) {
        // Every request looks the same until a gate decides.
        ctx.fillStyle =
          p.stopAt < 0 && p.x > gateX[4] ? colors.accent : colors.ink;
        ctx.fillText(p.text, p.x, rowY(p.row));
      }

      const top = CELL_H * 1.3;
      const h = rowY(rows - 1) + CELL_H - top;
      ctx.fillStyle = colors.soft;
      GATES.forEach((gate, i) => {
        hatch(ctx, gateX[i], top, GATE_W, h, colors.ink);
        ctx.fillText(
          gate.label,
          gateX[i] + GATE_W / 2 - (gate.label.length * cw) / 2,
          CELL_H * 0.6,
        );
      });
      ctx.fillText("app", width - 3 * cw, CELL_H * 0.6);

      ctx.fillStyle = colors.stamp;
      for (const st of stamps) {
        ctx.globalAlpha = Math.min(1, st.life * 1.6);
        ctx.fillText(st.text, st.x, st.y);
      }
      ctx.globalAlpha = 1;

      const tally =
        width < 480
          ? `stopped ${pad(counts[0] + counts[1] + counts[2] + counts[3])} · routed ${pad(counts[4])}`
          : `pow ${pad(counts[0], 2)} · 429 ${pad(counts[1], 2)} · geo ${pad(counts[2], 2)} · 403 ${pad(counts[3], 2)} · routed ${pad(counts[4])}`;
      ctx.fillStyle = colors.soft;
      ctx.fillText(tally, 0, height - CELL_H * 0.6);
    },
  };
}

export function PipelineStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAsciiCanvas(canvasRef, createScene, 16);

  return (
    <figure className="m-0">
      <div aria-hidden="true">
        <canvas ref={canvasRef} className="block h-56 w-full sm:h-64" />
      </div>
      <figcaption className="mt-3 font-hand text-xl text-ink-soft">
        fig. 2: each request stops at the first check it fails
      </figcaption>
    </figure>
  );
}
