---
sidebar_position: 4
title: Rate Limiting
description: Per-IP token-bucket limiting with an in-process or Redis backend, plus per-service limits.
keywords: [rate limiting, token bucket, redis, per-ip limiting]
---


Coraza WAF Mod applies **per-client-IP token-bucket** limiting globally ahead of geo/WAF inspection,
plus optional **per-service** limits. There are two interchangeable backends, chosen from the
dashboard (**Settings → Rate limiting**); switching is a hot reload with no restart.

## How the token bucket works

Each tracked IP gets a bucket holding up to `burst` tokens, refilled continuously at `rps` tokens per
second. A request consumes one token; if the bucket is empty, the request is rejected
(`RateLimitedTotal` / `rate_limited` in the log). `burst` is effectively "how many requests can arrive
back-to-back before throttling kicks in," and `rps` is the sustained long-run rate after that burst is
spent.

*Example:* `rps=5, burst=20` allows a client to fire 20 requests instantly, then sustain roughly 5
requests/second indefinitely — a sudden 100-request burst gets the first 20 through and throttles the
rest until tokens refill.

The **global limiter is disabled by default** (no rate limiting at all until you opt in from
Settings).

## In-process limiter (default backend)

A per-IP token bucket lives in memory; its state is snapshotted to SQLite **every 10 seconds** and
restored on startup, so limits survive restarts. Idle buckets (no traffic for 5 minutes) are reclaimed
by a background janitor so the bucket map stays bounded despite an unbounded number of distinct
client IPs over time. This is the right choice for a single node.

## Redis backend (multi-node)

Select Redis in the dashboard and provide the address + password. The limiter becomes an atomic
Redis Lua-script token bucket shared across all WAF instances, so a cluster enforces one combined
limit. If Redis becomes unreachable, the backend **fails open** (it allows traffic rather than
blocking everything).

Use **Test connection** in Settings to verify Redis reachability **before** saving.

## Configuration reference

| Setting | Form field | Meta key | Notes |
|---|---|---|---|
| Enabled | `rl_enabled` | `ratelimit_enabled` | Off by default. |
| Requests/sec | `rl_rps` | `ratelimit_rps` | Sustained rate once burst is spent. |
| Burst | `rl_burst` | `ratelimit_burst` | Max tokens a bucket can hold; effectively the allowed instantaneous spike. |
| Backend | `rl_backend` | *(derived, see below)* | `memory` or `redis`. |
| Redis address | `rl_redis_addr` | `redis_addr` | `host:port`. |
| Redis password | `rl_redis_password` | `redis_password` | Empty if Redis has no auth. |

Saved via `POST /admin/settings/ratelimit`; test Redis reachability first with
`POST /admin/settings/ratelimit/test` (same `rl_redis_addr`/`rl_redis_password` fields, doesn't
persist anything).

:::note[There's no standalone "backend" flag in storage]
Startup and every reload derive the backend from whether a Redis address is currently stored, not
from a separate persisted choice: `rl_backend=redis` **pings Redis synchronously** during the save
(rejecting the save outright if it's unreachable) and then stores the address; `rl_backend=memory`
clears the stored Redis address. So "the backend" is really just "is `redis_addr` set or empty" at
read time.
:::

## Per-service limits

Each service can carry its own limiter (always in-process — per-service distribution isn't needed).
Set it from the service's Manage panel (`rps` + `burst`), or in the add wizard. These run **after**
the global limit, so a request must clear both. Per-service limits are never affected by
[adaptive enforcement](/docs/security/threat-score#adaptive-enforcement) — that only scales the
global limiter.

## Ordering

Global rate limiting runs **early** in the pipeline (after the IP blocklist, before geo and WAF), so
throttled clients are rejected cheaply. See [Architecture](/docs/overview/architecture) for the full
pipeline order.
