---
slug: /intro
sidebar_position: 1
title: What It Does
description: A single-binary Web Application Firewall and reverse proxy for Linux, built on Coraza v3 and the OWASP Core Rule Set.
---


A single-binary **Web Application Firewall + reverse proxy** for Linux, built in Go on top of
[Coraza v3](https://github.com/corazawaf/coraza) (OWASP Core Rule Set) with a built-in
HTMX/Tailwind admin dashboard. There is **no Docker requirement, no external database, and no
Node toolchain** — one binary, one SQLite file.

![Coraza WAF Mod Architecture: User Request → Cloudflare → OS Firewall → Coraza WAF Proxy (with SQLite waf.db and HTMX/Tailwind Admin Dashboard) → Application Service](/img/arch_diagram_white-bg.png)

## What it does

Coraza WAF Mod sits in front of one or more backend web applications and inspects every incoming
HTTP request before it is allowed to reach a backend. For each request it runs an ordered
pipeline of defensive checks — bot challenge, IP blocklist, rate limiting, geo blocking, and full
WAF rule inspection — and only then reverse-proxies the request to the matching backend. Every
decision (blocked or allowed) is logged asynchronously to a local SQLite database, and the whole
thing is managed live from a built-in web dashboard with no restarts required.

It is designed to be **operationally boring**: a single statically-linked binary, a single SQLite
file for all state, a systemd unit, and an optional prune timer. Everything else — services,
rules, TLS, bot settings, rate limits — is configured at runtime through the dashboard and stored
in the database.

## What's inside

- **WAF inspection** — Coraza v3 + OWASP CRS compiled in; blocks SQLi, XSS, RCE, path traversal,
  and scanners out of the box. See [WAF Inspection](/docs/security/waf).
- **Reverse proxy & multi-app routing** — host- and prefix-based routing to many backends from one
  front door, hot-reloaded with no restart. See [Architecture](/docs/overview/architecture).
- **IP & geo blocking** — manual allow/block rules, automatic IP banning, and bundled GeoLite2
  country blocking. See [IP & Geo Blocking](/docs/security/blocking).
- **Rate limiting** — per-IP token bucket, in-process or Redis-backed for multi-node. See
  [Rate Limiting](/docs/configuration/rate-limiting).
- **Bot protection** — header-based scoring with a JavaScript proof-of-work challenge, plus JA4 TLS
  fingerprinting and ASN lookup. See [Bot Protection](/docs/security/bot-and-fingerprinting).
- **Threat-intel auto-sync & webhooks** — pull external IP blocklists and forward events. See
  [Threat Intel & Webhooks](/docs/security/threat-intel-webhooks).
- **Unified threat scoring & adaptive enforcement** — a composite 0–100 per-IP risk score (autoban
  history, bot score, ASN/hosting classification, geo risk, JA4 repeat-offender history) that can, if
  enabled, automatically tighten the global rate limit or force a bot challenge for high-risk clients.
  See [Threat Score & Adaptive Enforcement](/docs/security/threat-score).
- **Varnish caching** — an optional per-service cache that sits *behind* the WAF, so nothing reaches
  the cache or backend without passing the full pipeline. See [Varnish Cache](/docs/configuration/varnish).
- **Email alerts** — daily traffic digest and instant ban-alert emails when the autoban engine blocks
  a new IP, with a display name so alerts arrive as *Coraza WAF Mod* in your inbox.
- **TLS / HTTPS** — plain HTTP, automatic Let's Encrypt, or your own certs, mixable per service. See
  [TLS Setup](/docs/configuration/tls).
- **Admin dashboard** — server-rendered HTMX + Tailwind, session-cookie auth, everything live. See
  [Using the Dashboard](/docs/configuration/dashboard).
- **Prometheus metrics & request logging** — per-cause counters, async SQLite logging, an optional
  nginx-style `access.log`, and a live in-dashboard terminal view of the same stream. See
  [Metrics](/docs/configuration/metrics) and [Access Log](/docs/configuration/access-log).

Ready to install? Head to [Requirements](/docs/installation/requirements).
