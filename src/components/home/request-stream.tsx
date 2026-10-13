"use client";

import { useRef } from "react";
import { CELL_H, hatch, pad, type Scene, useAsciiCanvas } from "./ascii-canvas";

// Requests drift left-to-right toward the WAF wall. Clean ones pass through
// to the backend; attacks hit the wall, get stamped 403 and crumble into
// glyphs. Drawn as monospace text so it reads as part of the page, not a
// separate graphics layer.

const CLEAN = [
  "GET /",
  "GET /api/orders",
  "POST /login",
  "GET /static/app.css",
  "GET /health",
  "PUT /api/cart/7",
  "GET /blog/hello",
];

const ATTACKS = [
  "GET /?id=1' OR 1=1--",
  "GET /q=<script>",
  "GET /../../etc/passwd",
  "POST /;cat /etc/shadow",
  "GET /wp-login.php",
];

const WALL_W = 24; // 1.5rem band, hatched every 0.5rem

type Packet = {
  row: number;
  x: number;
  text: string;
  bad: boolean;
  speed: number;
};

type Shard = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ch: string;
};

function createScene(): Scene {
  let rows = 0;
  let wallX = 0;
  let packets: Packet[] = [];
  let shards: Shard[] = [];
  let stamps: { x: number; y: number; life: number }[] = [];
  let passed = 0;
  let blocked = 0;
  let sinceSpawn = 0;
  const rowY = (r: number) => CELL_H * 2 + r * CELL_H * 1.5;

  return {
    resize({ width, height }) {
      rows = Math.max(4, Math.floor((height - CELL_H * 3) / (CELL_H * 1.5)));
      wallX = Math.round(width * (width < 520 ? 0.68 : 0.74));
    },

    step(dt, { width, cw }) {
      sinceSpawn += dt;
      if (sinceSpawn > 1.1 && packets.length < rows) {
        sinceSpawn = 0;
        const bad = Math.random() < 0.32;
        const pool = bad ? ATTACKS : CLEAN;
        const text = pool[Math.floor(Math.random() * pool.length)];
        const used = new Set(
          packets.filter((p) => p.x < 160).map((p) => p.row),
        );
        let row = Math.floor(Math.random() * rows);
        for (let i = 0; i < rows && used.has(row); i++) row = (row + 1) % rows;
        packets.push({
          row,
          x: -text.length * cw,
          text,
          bad,
          speed: 55 + Math.random() * 35,
        });
      }

      const next: Packet[] = [];
      for (const p of packets) {
        p.x += p.speed * dt;
        if (p.bad && p.x + p.text.length * cw >= wallX) {
          blocked++;
          const y = rowY(p.row);
          stamps.push({ x: wallX - cw * 6, y, life: 1 });
          for (let i = 0; i < p.text.length; i++) {
            shards.push({
              x: p.x + i * cw,
              y,
              vx: -20 - Math.random() * 40,
              vy: -30 + Math.random() * 80,
              life: 1,
              ch: p.text[i] === " " ? "·" : p.text[i],
            });
          }
        } else if (p.x > width) passed++;
        else next.push(p);
      }
      packets = next;

      for (const s of shards) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 140 * dt;
        s.life -= dt * 0.9;
      }
      shards = shards.filter((s) => s.life > 0);
      for (const st of stamps) st.life -= dt * 0.7;
      stamps = stamps.filter((st) => st.life > 0);
    },

    draw({ ctx, width, height, cw, colors }) {
      // Lane guides: faint dotted rows, like ruled notebook lines.
      ctx.fillStyle = colors.rule;
      for (let r = 0; r < rows; r++) {
        for (let x = 0; x < width; x += cw * 3) ctx.fillText("·", x, rowY(r));
      }

      for (const p of packets) {
        ctx.fillStyle = p.bad ? colors.stamp : colors.ink;
        ctx.fillText(p.text, p.x, rowY(p.row));
      }

      // The wall is drawn over the packets, so clean ones vanish into the
      // hatching and come out the other side.
      const top = CELL_H * 1.3;
      hatch(ctx, wallX, top, WALL_W, rowY(rows - 1) + CELL_H - top, colors.ink);

      ctx.fillStyle = colors.soft;
      ctx.fillText("internet", 0, CELL_H * 0.6);
      ctx.fillText("palisade", wallX + WALL_W / 2 - cw * 4, CELL_H * 0.6);
      ctx.fillText("backend", width - 7 * cw, CELL_H * 0.6);

      ctx.fillStyle = colors.stamp;
      for (const s of shards) {
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillText(s.ch, s.x, s.y);
      }
      for (const st of stamps) {
        ctx.globalAlpha = Math.min(1, st.life * 1.5);
        ctx.fillText("[403]", st.x, st.y);
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = colors.soft;
      ctx.fillText(
        `passed ${pad(passed)}  ·  blocked ${pad(blocked)}`,
        0,
        height - CELL_H * 0.6,
      );
    },
  };
}

export function RequestStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAsciiCanvas(canvasRef, createScene);

  return (
    <figure className="m-0">
      <div aria-hidden="true">
        <canvas ref={canvasRef} className="block h-72 w-full sm:h-80" />
      </div>
      <figcaption className="mt-3 font-hand text-xl text-ink-soft">
        fig. 1: clean requests go through the hatched wall, attacks get a 403
      </figcaption>
    </figure>
  );
}
