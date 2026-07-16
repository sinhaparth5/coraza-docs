---
sidebar_position: 5
title: Threat Intel & Webhooks
description: Auto-sync external IP blocklists into the blocklist, and forward request events to a webhook asynchronously.
---


## Threat-intel auto-sync

- A background worker periodically downloads external **plain-text IP block lists**, parses out
  IP/CIDR tokens (ignoring `#`/`;` comments, capped at a 10 MiB read), and writes them into the
  database.
- The IP blocklist reads from the same store, so synced IPs take effect **immediately via hot
  reload** — no restart.
- A **"sync now"** button in the dashboard fetches a single source on demand.

Add a source on the **Threat Intel** page (`/admin/threat-intel`) with a **label**, a **URL** to a
plain-text IP/CIDR list, and a sync **interval (hours)**. Each row can be toggled, synced now, or
deleted. See the [dashboard walkthrough](/docs/configuration/dashboard).

## Webhook event delivery

- Forwards request events to a configured webhook endpoint, **fully asynchronously** — delivery runs
  on a background goroutine reading off a 500-entry buffered queue, so a slow or unreachable endpoint
  never blocks the logging pipeline. If the queue is ever full, new events are **dropped silently**
  rather than backing up the log worker.
- Each delivery is an `HTTP POST` with `Content-Type: application/json` and a 5-second client
  timeout. The body is the **full logged request row** (JSON-marshaled `storage.RequestLog` — the
  same fields as a log detail view: timestamp, app, IP, method, path, status, country, ASN, JA4, the
  matched WAF rule/action, etc.).
- Delivery is filtered by a configurable, comma-separated **event list** managed from the dashboard.
  If no events are selected it defaults to `blocked`.

  | Category | Matches |
  |---|---|
  | `blocked` | Any request the pipeline blocked (`entry.Blocked == true`) — IP/geo/WAF/rate-limit denials. |
  | `challenged` | Redirected to the bot challenge — matched by prefix, so both the plain `bot_challenge` action and the adaptive-enforcement-forced `bot_challenge:adaptive` variant count. |
  | `all` | Every request, including normally proxied ones. |

- **Authentication is a shared secret, not a computed signature.** If `webhook_secret` is set, every
  delivery carries it verbatim as an `X-WAF-Secret` header — the receiver should compare that header
  against its own copy of the secret (constant-time compare) rather than expect an HMAC over the
  body.

Configure it under **Settings → Webhooks** (`POST /admin/settings/webhook` with `webhook_url`,
`webhook_secret`, `webhook_enabled=1`, and one or more `webhook_events` checkboxes).

### Receiving a delivery

The row has **no JSON tags**, so it marshals with the Go struct's exact (capitalized) field names —
not `snake_case`:

```text
POST /your-endpoint HTTP/1.1
Content-Type: application/json
User-Agent: coraza-waf-mod/internal/notify/webhook
X-WAF-Secret: your-configured-secret

{
  "ID": 1042,
  "Timestamp": "2026-07-11T12:51:34Z",
  "AppName": "gemsofcongress",
  "RealIP": "203.0.113.10",
  "ProxyIP": "104.16.0.1",
  "Country": "US",
  "Method": "PATCH",
  "Host": "cdn.gemsofcongress.com",
  "Path": "/api/v1/posts/27",
  "Query": "",
  "Status": 403,
  "Blocked": true,
  "RuleID": 911100,
  "Action": "deny",
  "UserAgent": "node",
  "Duration": 4,
  "HeadersJSON": "{...}",
  "RequestID": "a1b2c3d4e5f6",
  "Proto": "HTTP/2.0",
  "TLSVersion": "TLS 1.3",
  "TLSCipher": "TLS_AES_128_GCM_SHA256",
  "TLSSNI": "cdn.gemsofcongress.com",
  "ASN": 13335,
  "Org": "Cloudflare, Inc.",
  "JA3Hash": "",
  "JA4": "t13d1516h2_8daaf6152771_02713d6af862",
  "VisitorID": "",
  "BotScore": 0
}
```

`HeadersJSON` is itself a JSON-encoded `map[string]string` of the original request headers — decode
it as a nested document if you need header-level detail.

A non-2xx response is logged server-side but **never retried** — treat the webhook as best-effort
notification, not a guaranteed-delivery queue.
