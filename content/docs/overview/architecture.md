---
sidebar_position: 2
title: Architecture
description: The request pipeline, storage model, hot reload, multi-app routing, and bundled data.
---


## Request pipeline

Every request runs through a single `Handle` method, in strict order:

1. **Bot challenge gate** — non-trusted clients without a valid bypass cookie are redirected to the
   JS proof-of-work challenge (subject to global + per-service bot mode, OR'd with a force-challenge
   decision from [adaptive enforcement](/docs/security/threat-score) if enabled).
2. **IP blocklist check** — exact-match block rejects.
3. **Global rate limit** — per-IP token bucket, scaled up or down for high/low-risk IPs by the same
   adaptive-enforcement decision when enabled.
4. **Per-service rate limit** — optional, after routing (never scaled by adaptive enforcement — that
   only touches the global limiter).
5. **Geo blocklist check** — country block by resolved client IP.
6. **Coraza WAF inspection** — full CRS + custom rules, via a per-service override engine when that
   service has its own [rule exceptions](/docs/security/waf#per-service-exceptions), else the shared
   default engine.
7. **Reverse-proxy** to the matched backend.

Every stage logs the outcome via a **non-blocking queue** (buffered channel drained by one worker
goroutine), so the hot path never waits on the database. Every response — blocked or proxied — gets
its `Server` header forced to `Coraza WAF Mod` and the standard security headers applied.

## Reverse proxy & multi-app routing

Coraza WAF Mod routes to as many backend apps ("services") as you need from a single front door.
Two match modes per service:

- **Host match** — virtual hosting by `Host` header (e.g. `api.example.com` → one backend,
  `blog.example.com` → another). The request path is passed through untouched.
- **Prefix match** — route by URL path prefix (e.g. `/api` → a backend), with **automatic prefix
  stripping** before proxying, exactly like nginx `proxy_pass http://backend/`. The original client
  path is restored before logging so the dashboard shows what the client really requested.

**Routing precedence:** all prefix matches are evaluated first (**longest prefix wins**), then host
matches — mirroring nginx `location` blocks beating `server_name` defaults.

Each service gets its **own pre-built reverse proxy** with a 5-second dial timeout and a 10-second
response-header timeout, so a slow or dead backend cannot hold browser connection slots indefinitely. Services are
**database-backed and hot-reloaded**: adding, editing, or removing a service rebuilds the routing
registry instantly with **no restart**.

**Passive health tracking:** there is no background polling loop. A service is marked unhealthy when
a real proxied request fails and healthy again when one succeeds. The only active check is a single
one-shot reachability probe when a service is first added (to reject obviously-dead backends before
saving).

## State & storage

Everything lives in one SQLite file via the pure-Go `modernc.org/sqlite` driver. WAL mode plus a
bounded connection pool lets readers run concurrently with the single serialized writer. Services,
rules, TLS state, sessions, rate-limit snapshots, and settings are all DB-backed. Uploaded TLS
private keys are the one exception — those live on disk at mode `0600`.

Request logging itself is **fire-and-forget**: every pipeline stage enqueues its outcome on a
buffered channel drained by a dedicated worker goroutine, so logging never blocks the request hot
path. Logs are retained for a configurable number of days and pruned by a
[separate one-shot command](/docs/configuration/log-retention).

## Hot reload

The WAF engine, bot challenger, rate-limit backend, IP blocklist, and service registry are all
swapped behind read/write mutexes, so dashboard changes apply with no restart.

## Bundled data

The GeoLite2-Country and DB-IP ASN Lite databases, the OWASP CRS, and the minified dashboard JS are
all `//go:embed`-ed into the binary — there is nothing external to fetch at runtime. Everything (the
SQLite driver, GeoIP, ASN) is pure Go, so binaries are built with `CGO_ENABLED=0` and run with no
shared-library dependencies.

## Background subsystems

Beyond the request pipeline, several long-running goroutines are started once at boot and run for the
process lifetime, each wired to a DB-backed config that can change live from the dashboard:

- the [threat-intel](/docs/security/threat-intel-webhooks) sync worker,
- the [autoban](/docs/security/blocking#automatic-ip-banning) scorer — fed every logged event, using
  the same fire-and-forget pattern as the log queue,
- the [threat score](/docs/security/threat-score) scorer — a third log fan-out hook that computes
  each IP's composite risk score asynchronously and caches it in memory for the adaptive-enforcement
  hot-path lookup,
- the [webhook](/docs/security/threat-intel-webhooks) pusher,
- the [daily-report mailer](/docs/configuration/email-alerts),
- and — when [Varnish caching](/docs/configuration/varnish) is used by any service — a permanent
  loopback-only HTTP listener that Varnish's static VCL sends cache misses to, which resolves the
  correct backend from the live service registry rather than from anything baked into Varnish's config.

## TLS fingerprinting

[JA4 and JA3](/docs/security/bot-and-fingerprinting) are computed in `GetConfigForClient` at handshake
time and cached per-connection until the connection closes, so per-request lookup never touches the
network or the database.
