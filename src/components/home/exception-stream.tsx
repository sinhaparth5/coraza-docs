"use client";

import { useRef } from "react";
import { CELL_H, type Scene, useAsciiCanvas } from "./ascii-canvas";

// A scripted loop through the dashboard's log view: a real customer gets a
// false-positive 403, one click on "create exception" turns that rule off
// for that service only, and the same request goes through. Then a dry-run
// replays logged traffic against a candidate rule without touching any of it.

type Row = {
  time: string;
  app: string;
  req: string;
  status: number;
  rule: string;
  born: number;
  fp?: boolean;
  mark?: string;
};

const NORMAL: Omit<Row, "time" | "born">[] = [
  { app: "shop", req: "GET /products/42", status: 200, rule: "" },
  { app: "api", req: "GET /v1/orders", status: 200, rule: "" },
  { app: "shop", req: "POST /cart", status: 200, rule: "" },
  { app: "blog", req: "GET /posts/hello", status: 200, rule: "" },
  { app: "api", req: "GET /v1/../../etc", status: 403, rule: "930100" },
  { app: "shop", req: "GET /checkout", status: 200, rule: "" },
  { app: "blog", req: "GET /?q=<script>", status: 403, rule: "941100" },
];
const FALSE_POSITIVE = {
  app: "shop",
  req: "GET /search?q=o'brien",
  rule: "942100",
};
const CYCLE = 14;

function createScene(): Scene {
  let rows: Row[] = [];
  let maxRows = 0;
  let t = 0;
  let wall = 4 * 3600 + 12 * 60; // fake wall clock, 04:12:00
  let sinceRow = 1;
  let fired = new Set<string>();

  const stamp = () => {
    wall += 1 + Math.floor(Math.random() * 3);
    const h = Math.floor(wall / 3600) % 24;
    const m = Math.floor(wall / 60) % 60;
    const s = wall % 60;
    return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  };
  const push = (row: Omit<Row, "time" | "born">) => {
    rows = [{ ...row, time: stamp(), born: t }, ...rows].slice(0, maxRows);
  };
  const once = (key: string, at: number, run: () => void) => {
    if (t >= at && !fired.has(key)) {
      fired.add(key);
      run();
    }
  };

  return {
    resize({ height }) {
      maxRows = Math.max(
        3,
        Math.floor((height - CELL_H * 5.5) / (CELL_H * 1.35)) + 1,
      );
      rows = rows.slice(0, maxRows);
    },

    step(dt) {
      t += dt;
      sinceRow += dt;
      const flowing = t < 2.5 || (t > 7 && t < 8.4);
      if (flowing && sinceRow > 0.8) {
        sinceRow = 0;
        push(NORMAL[Math.floor(Math.random() * NORMAL.length)]);
      }
      once("fp", 2.6, () => push({ ...FALSE_POSITIVE, status: 403, fp: true }));
      once("retry", 6.2, () =>
        push({ ...FALSE_POSITIVE, status: 200, rule: "", mark: "✓ passes" }),
      );
      once("dry", 10.4, () => {
        // The candidate rule would have flagged two requests that went
        // through: mark them, nothing else changes.
        let marked = 0;
        for (const row of rows) {
          if (marked < 2 && row.status === 200 && !row.mark && !row.fp) {
            row.mark = "would 403";
            marked++;
          }
        }
      });
      if (t > CYCLE) {
        t = 0;
        fired = new Set();
        for (const row of rows) {
          row.fp = false;
          if (row.mark === "would 403") row.mark = undefined;
        }
      }
    },

    draw({ ctx, width, height, cw, colors }) {
      const wide = width >= 520;
      const reqW = wide ? 24 : Math.max(14, Math.floor(width / cw) - 13);
      const cols = wide
        ? { time: 0, app: 10, req: 16, status: 17 + reqW, rule: 22 + reqW }
        : { time: -1, app: -1, req: 0, status: reqW + 1, rule: reqW + 6 };
      const col = (c: number) => c * cw;
      const rowY = (i: number) => CELL_H * 2 + i * CELL_H * 1.35;

      ctx.fillStyle = colors.soft;
      if (wide) {
        ctx.fillText("time", col(cols.time), CELL_H * 0.6);
        ctx.fillText("app", col(cols.app), CELL_H * 0.6);
      }
      ctx.fillText("request", col(cols.req), CELL_H * 0.6);
      ctx.fillText("code", col(cols.status), CELL_H * 0.6);
      ctx.fillText("rule", col(cols.rule), CELL_H * 0.6);
      ctx.fillStyle = colors.rule;
      ctx.fillRect(0, CELL_H * 1.2, width, 1);

      const selected = t > 3.4 && t < 9;
      rows.forEach((row, i) => {
        const y = rowY(i);
        ctx.globalAlpha = Math.min(
          1,
          (t - row.born) * 4 + (t < row.born ? 1 : 0),
        );
        if (row.fp && selected) {
          ctx.fillStyle = colors.highlight;
          ctx.globalAlpha *= 0.55;
          ctx.fillRect(0, y - CELL_H * 0.6, width, CELL_H * 1.2);
          ctx.globalAlpha = 1;
        }
        const req =
          row.req.length > reqW ? `${row.req.slice(0, reqW - 1)}…` : row.req;
        ctx.fillStyle = colors.soft;
        if (wide) {
          ctx.fillText(row.time, col(cols.time), y);
          ctx.fillText(row.app, col(cols.app), y);
        }
        ctx.fillStyle = colors.ink;
        ctx.fillText(req, col(cols.req), y);
        ctx.fillStyle = row.status === 200 ? colors.accent : colors.stamp;
        ctx.fillText(String(row.status), col(cols.status), y);
        if (row.mark) {
          ctx.fillStyle = row.mark.startsWith("✓")
            ? colors.accent
            : colors.stamp;
          ctx.fillText(row.mark, col(cols.rule), y);
          if (!row.mark.startsWith("✓")) {
            const w = row.mark.length * cw + cw;
            ctx.strokeStyle = colors.stamp;
            ctx.setLineDash([3, 3]);
            ctx.strokeRect(
              col(cols.rule) - cw / 2,
              y - CELL_H * 0.55,
              w,
              CELL_H * 1.1,
            );
            ctx.setLineDash([]);
          }
        } else {
          ctx.fillStyle = colors.soft;
          ctx.fillText(row.rule, col(cols.rule), y);
        }
      });
      ctx.globalAlpha = 1;

      // The action panel under the log: button, toast, dry-run progress.
      const y1 = height - CELL_H * 2;
      const y2 = height - CELL_H * 0.7;
      ctx.fillStyle = colors.rule;
      ctx.fillRect(0, y1 - CELL_H * 0.9, width, 1);

      if (t > 3.4 && t < 8.5) {
        const label = "[ create exception ]";
        const pressed = t > 4.4 && t < 4.8;
        if (pressed) {
          ctx.fillStyle = colors.highlight;
          ctx.fillRect(
            -2,
            y1 - CELL_H * 0.55,
            label.length * cw + 4,
            CELL_H * 1.1,
          );
        }
        ctx.fillStyle = colors.ink;
        ctx.fillText(label, 0, y1);
        if (t < 4.8) {
          // Cursor glides in from the right and clicks the button.
          const k = Math.min(1, Math.max(0, (t - 3.6) / 0.8));
          const e = 1 - (1 - k) ** 3;
          const end = label.length * cw * 0.6;
          ctx.fillText(
            "↖",
            width - cw * 2 + (end - width + cw * 2) * e,
            y1 + CELL_H * 0.5,
          );
        }
        if (t > 4.8) {
          ctx.fillStyle = colors.accent;
          ctx.fillText(
            wide
              ? `✓ rule ${FALSE_POSITIVE.rule} off for "${FALSE_POSITIVE.app}" only · waf reloaded`
              : `✓ ${FALSE_POSITIVE.rule} off for ${FALSE_POSITIVE.app} · reloaded`,
            0,
            y2,
          );
        }
      } else if (t >= 8.5) {
        const k = Math.min(1, Math.max(0, (t - 8.6) / 1.8));
        const bar = Math.round(k * 10);
        ctx.fillStyle = colors.ink;
        ctx.fillText(
          `dry-run · replay 2000 logged [${"▓".repeat(bar)}${"░".repeat(10 - bar)}]`,
          0,
          y1,
        );
        if (t > 10.4) {
          ctx.fillStyle = colors.soft;
          ctx.fillText("2 verdicts would change · nothing saved", 0, y2);
        }
      } else {
        ctx.fillStyle = colors.soft;
        ctx.fillText("live · streaming from /admin/logs", 0, y1);
      }
    },
  };
}

export function ExceptionStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAsciiCanvas(canvasRef, createScene, 5.6);

  return (
    <figure className="m-0">
      <div aria-hidden="true">
        <canvas ref={canvasRef} className="block h-64 w-full" />
      </div>
      <figcaption className="mt-3 font-hand text-xl text-ink-soft">
        fig. 5: a false positive, fixed from the log, then a dry-run
      </figcaption>
    </figure>
  );
}
