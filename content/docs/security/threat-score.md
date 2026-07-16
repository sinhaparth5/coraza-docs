---
sidebar_position: 4
title: Threat Score & Adaptive Enforcement
description: A composite 0–100 per-IP risk score combining autoban, bot, ASN, geo, and JA4 signals, with optional automatic rate-limit scaling and forced bot challenges.
---


## Unified per-IP threat score

Every logged request feeds a **composite 0–100 risk score** per client IP. The score combines data
already collected by separate subsystems:

| Component | Weight | Source |
|---|---|---|
| Autoban's current point total for the IP | up to 40 | [Automatic IP banning](/docs/security/blocking#automatic-ip-banning)'s own sliding-window score |
| Bot-analysis score already on the request | up to 20 | [Bot protection](/docs/security/bot-and-fingerprinting) header scoring |
| ASN/hosting classification | flat 15 | A small heuristic over the bundled ASN database (allowlist + org-name keyword match), excluding Cloudflare's own ranges since the bot/challenge subsystem already trusts that traffic separately |
| Geo risk | flat 10 | Whether the resolved country has an admin-configured **block** [geo rule](/docs/security/blocking#geo--country-blocking) — reuses existing config, no new admin surface |
| JA4 repeat-offender history | up to 15 | Lifetime blocked-hit count for the client's [JA4](/docs/security/bot-and-fingerprinting) TLS fingerprint |

This is a **read model, not an enforcement mechanism** on its own — nothing in the scorer blocks or
challenges a request by itself. It only computes and persists the score (with its per-component
breakdown) so you can see *why* an IP looks risky.

Because scoring runs asynchronously, a few requests behind the one that triggered it, the score for a
given IP always reflects that IP's *previous* requests — never the one currently in flight. This is
the same one-request lag autoban's own ban already has.

**Where you see it:**

- A **"Score N"** badge on each row of the [IP Rules page](/docs/configuration/dashboard#ip-rules).
- A threat-score breakdown section in each request's [log detail view](/docs/configuration/dashboard#request-logs).

## Adaptive enforcement

Adaptive enforcement uses the score to scale the global rate limit and force a bot challenge for
high-risk clients. Both actions are reversible with the current architecture. Coraza's *paranoia
level* cannot be changed per request because it is fixed when the WAF engine is compiled. Supporting
several levels would require multiple full-CRS engines in memory, so this implementation does not do
that.

:::warning[Disabled by default]
Unlike autoban, adaptive enforcement starts **off**. The score uses heuristics, and ASN
classification can misfire. It can also relax the rate limit for low-risk IPs. Review the scores on
the IP Rules page before enabling it.
:::

**Two independently configurable thresholds**, so tightening the rate limit and forcing a challenge
don't have to happen at the same score:

| Setting | Default | Effect |
|---|---|---|
| High-risk threshold | `70` | Score at or above this tightens the global rate limit. |
| High-risk rate scale | `0.3` | Multiplier applied to rate + burst for high-risk IPs (e.g. cut to 30%). |
| Force-challenge threshold | `70` | A separate, typically **stricter** threshold — only past this does a high-risk client also get force-challenged, regardless of per-service bot mode. |
| Low-risk threshold | `10` | Score at or below this relaxes the global rate limit. |
| Low-risk rate scale | `1.5` | Multiplier for low-risk IPs (e.g. 150% of normal). Never forces a challenge. |

A scaled decision only ever touches the **global** rate limiter, not per-service limits, and a scale
that would floor the burst below 1 token is clamped to 1 — a scoring bug can reduce a client's
throughput but can never fully lock out traffic.

Since every decision re-reads the client's *current* score, adaptive enforcement is inherently
reversible: an IP whose score has since dropped is judged on its new score on the very next request,
unlike autoban's permanent block rule, which needs an explicit removal.

**Log transparency:** a block/challenge caused *only* by adaptive enforcement (not the plain rate
limit or per-service bot mode) is logged as `rate_limited:adaptive` / `bot_challenge:adaptive` instead
of the plain action string, so you can tell the two apart in the request log.

Configure both cards from **IP Rules → Adaptive enforcement** — see the
[dashboard walkthrough](/docs/configuration/dashboard#adaptive-enforcement).
