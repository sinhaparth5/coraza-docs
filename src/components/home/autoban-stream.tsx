"use client";

import { useRef } from "react";
import { CELL_H, hatch, type Scene, useAsciiCanvas } from "./ascii-canvas";

// One IP keeps probing. Each block it earns adds to its score (429 = 1,
// other WAF block = 2, critical WAF block = 5). At 10 points inside the
// window it is written to the blocklist and an alert email goes out; from
// then on it is turned away before the WAF and scores nothing. A regular
// visitor keeps getting through the whole time.

const ATTACKERS = ["203.0.113.9", "198.51.100.4", "192.0.2.77"];
const PROBES = [
  { text: "POST /login", points: 1, stamp: "[429] +1" },
  { text: "POST /login", points: 1, stamp: "[429] +1" },
  { text: "GET /.env", points: 2, stamp: "[403] +2" },
  { text: "POST /login", points: 1, stamp: "[429] +1" },
  { text: "?id=1' OR 1=1", points: 5, stamp: "[403] +5" },
];
const AFTER_BAN = 2;
const THRESHOLD = 10;
const GATE_W = 16;

type Packet = {
  x: number;
  y: number;
  text: string;
  speed: number;
  attack: boolean;
  points: number;
  stamp: string;
};

type Note = { x: number; y: number; text: string; life: number };

function createScene(): Scene {
  let x0 = 0;
  let listX = 0;
  let wallX = 0;
  let packets: Packet[] = [];
  let notes: Note[] = [];
  let rules: string[] = [];
  let attacker = 0;
  let score = 0;
  let sent = 0;
  let clock = 0;
  let sinceVisitor = 1;
  let banAt = -1;
  let banStamp = 0;
  let mail = -1; // 0..1 progress of the alert envelope, -1 when idle

  let narrow = false;
  let visitorY = 0;
  let laneY = 0;
  let verdictY = 0;
  let scoreY = 0;
  let rulesY = 0;

  return {
    resize({ width, cw }) {
      // Phones have no room for a label gutter, so the visitor and IP labels
      // move above their lanes and the lanes start at the left edge.
      narrow = width < 520;
      const k = narrow ? 1.25 : 0;
      visitorY = CELL_H * (2 + k);
      laneY = CELL_H * (3.6 + 2 * k);
      // Verdicts get their own row so they never sit on top of the next probe.
      verdictY = CELL_H * (5.1 + 2 * k);
      scoreY = CELL_H * (7 + 2 * k);
      rulesY = CELL_H * (8.6 + 2 * k);
      x0 = narrow ? 0 : 12 * cw;
      listX = narrow
        ? Math.round(width * 0.42)
        : Math.round(Math.max(x0 + 14 * cw, width * 0.45));
      wallX = Math.round(width * (narrow ? 0.74 : 0.7));
    },

    step(dt, { width, cw }) {
      clock += dt;
      sinceVisitor += dt;

      if (sinceVisitor > 1.7) {
        sinceVisitor = 0;
        packets.push({
          x: x0,
          y: visitorY,
          text: "GET /shop",
          speed: 75,
          attack: false,
          points: 0,
          stamp: "",
        });
      }

      const banned = banAt >= 0;
      const due = 0.6 + sent * 1.5;
      const more = banned
        ? sent < PROBES.length + AFTER_BAN
        : sent < PROBES.length;
      if (more && clock > (banned ? Math.max(due, banAt + 0.8) : due)) {
        const probe = banned
          ? { text: "POST /login", points: 0, stamp: "[blocked] +0" }
          : PROBES[sent];
        packets.push({
          x: x0,
          y: laneY,
          speed: 90,
          attack: true,
          ...probe,
        });
        sent++;
      }

      const next: Packet[] = [];
      for (const p of packets) {
        p.x += p.speed * dt;
        const head = p.x + p.text.length * cw;
        const gate = p.points === 0 ? listX : wallX;
        if (p.attack && head >= gate) {
          notes.push({
            x: gate + GATE_W / 2 - (p.stamp.length * cw) / 2,
            y: verdictY,
            text: p.stamp,
            life: 1,
          });
          score += p.points;
          if (!banned && score >= THRESHOLD) {
            banAt = clock;
            banStamp = 1;
            mail = 0;
            rules = [
              `${ATTACKERS[attacker]}  block  auto · score ${score}`,
              ...rules,
            ].slice(0, 2);
          }
          continue;
        }
        if (p.x > width) continue;
        next.push(p);
      }
      packets = next;

      for (const n of notes) n.life -= dt * 0.45;
      notes = notes.filter((n) => n.life > 0);
      if (mail >= 0) mail = mail + dt * 0.7 > 1 ? -1 : mail + dt * 0.7;
      banStamp = Math.max(0, banStamp - dt * 0.12);

      // Ban settles, then the next IP starts probing.
      if (banned && clock - banAt > 5.5 && packets.every((p) => !p.attack)) {
        attacker = (attacker + 1) % ATTACKERS.length;
        score = 0;
        sent = 0;
        clock = 0;
        banAt = -1;
      }
    },

    draw({ ctx, width, cw, colors }) {
      ctx.fillStyle = colors.rule;
      for (const y of [visitorY, laneY]) {
        for (let x = x0; x < width; x += cw * 3) ctx.fillText("·", x, y);
      }

      for (const p of packets) {
        ctx.fillStyle = p.attack ? colors.stamp : colors.ink;
        if (!p.attack && p.x > wallX) ctx.fillStyle = colors.accent;
        ctx.fillText(p.text, p.x, p.y);
      }

      const top = CELL_H * 1.3;
      const h = laneY + CELL_H * 0.7 - top;
      hatch(ctx, listX, top, GATE_W, h, colors.ink);
      hatch(ctx, wallX, top, GATE_W, h, colors.ink);

      ctx.fillStyle = colors.soft;
      ctx.fillText("blocklist", listX + GATE_W / 2 - 4.5 * cw, CELL_H * 0.6);
      ctx.fillText("waf", wallX + GATE_W / 2 - 1.5 * cw, CELL_H * 0.6);
      ctx.fillText("inbox", width - 5 * cw, CELL_H * 0.6);
      const labelDy = narrow ? -CELL_H * 1.1 : 0;
      ctx.fillText("visitor", 0, visitorY + labelDy);
      ctx.fillStyle = colors.stamp;
      ctx.fillText(ATTACKERS[attacker], 0, laneY + labelDy);

      for (const n of notes) {
        ctx.globalAlpha = Math.min(1, n.life * 1.6);
        ctx.fillText(n.text, n.x, n.y);
      }
      if (banStamp > 0) {
        ctx.globalAlpha = Math.min(1, banStamp * 3);
        // Phones need the verdict row for the blocklist note, so the ban
        // stamp sits at the end of the score meter instead.
        if (narrow) ctx.fillText("[auto-ban]", width - 10 * cw, scoreY);
        else ctx.fillText("[auto-ban]", 0, verdictY);
      }
      if (mail >= 0) {
        const e = 1 - (1 - mail) ** 3;
        const sx = wallX + GATE_W;
        const ex = width - 3 * cw;
        ctx.globalAlpha = 1 - mail * 0.3;
        ctx.fillStyle = colors.accent;
        ctx.fillText(
          "✉",
          sx + (ex - sx) * e,
          laneY + (CELL_H * 0.6 - laneY) * e,
        );
      }
      ctx.globalAlpha = 1;

      const filled = Math.min(THRESHOLD, score);
      const meter = `[${"■".repeat(filled)}${"□".repeat(THRESHOLD - filled)}]`;
      ctx.fillStyle = colors.soft;
      ctx.fillText("score", 0, scoreY);
      ctx.fillStyle = score >= THRESHOLD ? colors.stamp : colors.ink;
      ctx.fillText(`${meter} ${filled}/${THRESHOLD}`, 6 * cw, scoreY);
      if (width > 460) {
        ctx.fillStyle = colors.soft;
        ctx.fillText("in 10 min", 6 * cw + (meter.length + 7) * cw, scoreY);
      }

      ctx.fillStyle = colors.soft;
      ctx.fillText("ip_rules", 0, rulesY);
      rules.forEach((rule, i) => {
        ctx.fillStyle = i === 0 ? colors.ink : colors.soft;
        ctx.fillText(rule, 0, rulesY + CELL_H * 1.3 * (i + 1));
      });
      if (rules.length === 0) {
        ctx.fillStyle = colors.rule;
        ctx.fillText("(empty)", 0, rulesY + CELL_H * 1.3);
      }
    },
  };
}

export function AutobanStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAsciiCanvas(canvasRef, createScene, 9.6);

  return (
    <figure className="m-0">
      <div aria-hidden="true">
        <canvas ref={canvasRef} className="block h-64 w-full sm:h-60" />
      </div>
      <figcaption className="mt-3 font-hand text-xl text-ink-soft">
        fig. 4: ten points in ten minutes and the IP is banned for good
      </figcaption>
    </figure>
  );
}
