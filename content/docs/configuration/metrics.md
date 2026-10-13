---
sidebar_position: 7
title: Prometheus Metrics
description: The Prometheus exposition endpoint and the counters, gauges, and runtime metrics it exposes.
keywords: [prometheus, metrics, monitoring, exposition format]
---


Palisade exposes a Prometheus exposition endpoint at **`/admin/metrics`**.

:::tip[Scrape with an API key]
`/admin/metrics` uses the dashboard's session-cookie login, so a Prometheus job can't authenticate to
it. Scrape **`GET /admin/api/v1/metrics`** instead: it returns the same metrics and accepts a
[REST API](/docs/configuration/rest-api) bearer key. A read-only key is enough.

```yaml
scrape_configs:
  - job_name: coraza-waf-mod
    metrics_path: /admin/api/v1/metrics
    authorization:
      type: Bearer
      credentials_file: /etc/prometheus/coraza.key
    static_configs:
      - targets: ["waf.example.com:8080"]
```
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

## Health probes

Two unauthenticated endpoints answer on every host, and are left out of the stdout request log:

| Endpoint | Returns `200` when | Otherwise |
|---|---|---|
| `GET /_cz/healthz` | the process is up (liveness) | — |
| `GET /_cz/readyz` | the database answers a ping within 2 s (readiness) | `503 db unavailable` |

Both also accept `HEAD`. Point a Kubernetes `livenessProbe`/`readinessProbe` or a load balancer
health check at them. Without curl, use the
[`healthcheck` subcommand](/docs/configuration/cli), which is what the Docker image's `HEALTHCHECK`
runs.
