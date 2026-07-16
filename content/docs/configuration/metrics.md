---
sidebar_position: 7
title: Prometheus Metrics
description: The Prometheus exposition endpoint and the counters, gauges, and runtime metrics it exposes.
---


Coraza WAF Mod exposes a Prometheus exposition endpoint at **`/admin/metrics`**.

:::warning It is behind session-cookie auth, not HTTP Basic Auth
The endpoint is protected by the **same session-cookie admin authentication** as every other dashboard
page — it is **not** HTTP Basic Auth. A Prometheus `basic_auth:` scrape config therefore cannot
authenticate to it: an unauthenticated scrape is redirected (302) to the login page rather than
challenged for credentials. Scraping it currently requires either a code change to exempt the route,
or proxying through something that holds a valid admin session cookie.
:::

## Metric reference

| Metric | Type | Labels | Meaning |
|---|---|---|---|
| `coraza_http_requests_total` | Counter | `app`, `status` | Every request handled, by final HTTP status code. |
| `coraza_http_request_duration_seconds` | Histogram | `app` | Request handling latency, including WAF inspection and proxying. Default Prometheus buckets. |
| `coraza_ip_blocked_total` | Counter | `app` | Denied by the IP blocklist. |
| `coraza_geo_blocked_total` | Counter | `app`, `country` | Denied by a country/geo rule. |
| `coraza_waf_blocked_total` | Counter | `app`, `action` | Denied by Coraza, labeled by the matched rule's action. |
| `coraza_rate_limited_total` | Counter | `app` | Denied by the per-IP rate limiter. |
| `coraza_bot_challenged_total` | Counter | `app` | Redirected to the JS proof-of-work challenge. |
| `coraza_log_queue_depth` | Gauge | — | Current buffered request-log entries waiting to be written to SQLite (see [State & storage](/docs/overview/architecture#state--storage)). Read live on every scrape, not polled. |
| `coraza_services_total` | Gauge | — | Number of backend services currently configured. |
| `coraza_rate_limit_tracked_ips` | Gauge | — | Per-IP token buckets currently held in memory. |

Plus the standard Go runtime/process metrics (`go_*`, `process_*`) that `promhttp.Handler()` exposes
automatically.

:::note[Per-cause counters vs. adaptive-enforcement-triggered events]
`coraza_rate_limited_total` and `coraza_bot_challenged_total` increment for **both** a plain
rate-limit/challenge decision and one forced by
[adaptive enforcement](/docs/security/threat-score#adaptive-enforcement) — the metric doesn't
distinguish the two (the request log's `action` column does, via the `:adaptive` suffix).
:::

## Example output

```text
# HELP coraza_http_requests_total Total requests handled, labeled by app and final HTTP status code.
# TYPE coraza_http_requests_total counter
coraza_http_requests_total{app="api",status="200"} 18234
coraza_http_requests_total{app="api",status="403"} 112
# HELP coraza_waf_blocked_total Requests denied by the Coraza WAF, labeled by app and the matched rule's action.
# TYPE coraza_waf_blocked_total counter
coraza_waf_blocked_total{app="api",action="deny"} 47
# HELP coraza_log_queue_depth Current number of request-log entries buffered waiting to be written to SQLite.
# TYPE coraza_log_queue_depth gauge
coraza_log_queue_depth 0
```

For the live in-dashboard view of the same data, see the [dashboard home](/docs/configuration/dashboard)
(traffic and threat charts).
