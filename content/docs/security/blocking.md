---
sidebar_position: 2
title: IP & Geo Blocking
description: Manual IP allow/block rules, automatic IP banning, and bundled GeoLite2 country blocking — all enforced early and hot-reloaded.
---


Three independent mechanisms feed the same IP block list, all enforced **early** in the pipeline
(before the WAF) and all hot-reloaded on change. Manage them from the dashboard — see
[Blocks](/docs/configuration/dashboard).

## IP blocklisting

- Manual **allow/block** rules for individual IPs (or CIDR ranges), managed from the dashboard.
- Exact-match enforcement evaluated very early in the pipeline (before geo and WAF) so blocked IPs
  are rejected cheaply.
- Augmented automatically by the [threat-intel sync](/docs/security/threat-intel-webhooks) feature —
  synced IPs flow into the same blocklist and take effect immediately via hot reload.
- Also populated automatically by the **autoban** system (see below).

## Automatic IP banning

The autoban engine watches the log fan-out pipeline and scores blocked events per client IP inside a
configurable **sliding time window**. When a single IP accumulates enough points, it is automatically
written as a permanent global block rule and the blocklist is hot-reloaded — no manual intervention
required.

### Scoring

| Event | Points |
|---|---|
| WAF block — critical class (SQLi, RCE, XSS, LFI, RFI rules) | **5** |
| WAF block — other rule | **2** |
| Rate-limited | **1** |
| Unsolved bot-challenge redirect ([see Bot Protection](/docs/security/bot-and-fingerprinting)) | **1** |
| Already-blocked traffic | **0** (banned IPs never score again) |

### Defaults and tuning

| Setting | Default | Notes |
|---|---|---|
| Enabled | **on** | Toggle from **IP Rules → Automatic banning** card |
| Score threshold | **10 points** | Ban triggers when an IP crosses this within the window |
| Window | **10 minutes** | Sliding window; resets per IP on each new event |

Threshold **10 / 10 min** is roughly two critical WAF hits, four generic WAF hits, or ten
rate-limited/challenged requests.

**Threshold guidance:**

- **Default (10 / 10 min)** is appropriate for most sites — an attacker running a SQLi scan hits
  threshold in two critical-class blocks (5 × 2 = 10).
- Raise to **20+** for sites that serve developer tools, SQL-heavy search forms, or shared-IP
  environments (universities, corporate NAT) to reduce false-positive bans.

### What happens on a ban

1. A permanent global `block` rule is written to `ip_rules` with a machine-stamped note (reason,
   score, timestamp).
2. The in-memory IP blocklist hot-reloads — subsequent requests from the IP are rejected immediately.
3. A **ban-alert email** is sent (if email alerts are configured) with the IP address, trigger reason,
   and timestamp.
4. The IP row in the **IP Rules** page shows an amber **Auto** badge and the ban reason.

### Exemptions & admin precedence

- **Private, loopback, link-local, and unspecified IPs are never auto-banned.**
- An existing admin rule (**allow** *or* **block**) for an IP always takes precedence: the autoban
  engine calls `GetIPRuleType` before scoring, and if a manual rule exists it leaves the IP untouched —
  your manual rules are never overwritten.

### Dashboard controls

The **Automatic banning** card on the **IP Rules** page (`/admin/ip-rules`) exposes:

- **Enable / disable** toggle (`POST /admin/ip-rules/autoban` with `autoban_enabled=1`).
- **Score threshold** and **window (minutes)** fields.

Changes take effect immediately via hot reload on the `Banner` subsystem.

## Geo / country blocking

- Country-level blocking using **MaxMind GeoLite2-Country**, with the database **bundled into the
  binary** — fresh installs block by country with **no MaxMind account or download step**.
- You can override the bundled database with a newer external `.mmdb` via the `--geo-db` flag.
- The client country is resolved from the [real client IP](/docs/security/trusted-proxy), so it works
  correctly behind Cloudflare or a trusted load balancer.

Enter a **2-letter ISO country code** (`RU`, `CN`, `US` — case-insensitive) and a rule type
(`block`/`allow`) on the **Geo Rules** page; the geo blocker reloads instantly.
