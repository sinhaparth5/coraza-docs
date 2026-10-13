---
sidebar_position: 1
title: WAF Inspection
description: Coraza v3 with the OWASP Core Rule Set compiled in, including custom rules and rule exceptions.
keywords: [waf inspection, coraza, owasp crs, sql injection, xss, rce]
---


- Embeds **Coraza v3** with the **OWASP Core Rule Set (CRS)** compiled directly into the binary —
  there is nothing to download or mount.
- Out of the box it detects and blocks common attack classes: **SQL injection, XSS, remote code
  execution, path traversal, restricted-file access**, and **known scanner user agents**.
- Custom `.conf` rule files can be layered **on top of** the CRS by pointing the `--waf-rules` flag
  at a directory.
- WAF rules can be **individually disabled** from the dashboard (the engine reads the disabled-rule
  list from the database and rebuilds itself live), so you can silence a noisy rule without editing
  files or restarting.

:::warning[Important engine behavior]
The recommended Coraza config ships in `DetectionOnly` mode by default, and the project deliberately
enables blocking (`SecRuleEngine On`) **after** the CRS includes so that rules actually block rather
than merely score. This is handled internally.
:::

## The compiled directive set

Every engine (the shared default one, and any [per-service exception](#per-service-exceptions)
engine) is built from the same base directive block, with `SecRuleRemoveById` appended only when
there's a disabled-rule list to apply:

```apache
Include @coraza.conf-recommended
Include @crs-setup.conf.example
Include @owasp_crs/*.conf
SecRuleEngine On
SecRequestBodyAccess On
SecResponseBodyAccess Off
SecRequestBodyLimit <configured limit, bytes>
SecRequestBodyLimitAction Reject
SecDebugLogLevel 0
SecRuleRemoveById <space-separated rule IDs>   # only present if the disabled-rule list is non-empty
```

**Ordering matters:** `@coraza.conf-recommended` sets `SecRuleEngine DetectionOnly`, and Coraza
applies directives in parse order. `SecRuleEngine On` must come **after** the three `Include` lines,
or every rule still matches and
scores but nothing is ever actually blocked (the request would be logged, but proxied through
anyway). If you point `--waf-rules` at a directory of custom `.conf` files, they're appended as one
more `Include "<dir>/*.conf"` directive **after** this block. A custom rule file can therefore use
CRS's transformation and collection setup, with blocking enabled before the file is parsed.

`SecResponseBodyAccess Off` disables response-body buffering and inspection. Only requests are
inspected, avoiding extra WAF latency for large or streamed backend responses.

## Request body size limits

Bodies are inspected up to a size limit that depends on their declared `Content-Type`, since the
cost of running CRS's ~200 rules over a body scales with how much of it ends up in `ARGS`:

| Body shape | Limit | Why |
|---|---|---|
| `multipart/form-data` | **~12.5 MiB** (`SecRequestBodyLimit`) | Coraza routes file parts to `FILES`, not `ARGS`, so CRS never scans the file bytes. A multipart upload at this size costs only tens of milliseconds. |
| Everything else that's inspected (JSON, plain text, etc.) | **128 KiB** | A body with no file parts is parsed into `ARGS` in full, and every byte of it is run through CRS's rule set. |
| Content types Coraza doesn't recognize as a form (images, binaries, video, arbitrary uploads) | **not inspected — streamed straight through** | Coraza only infers a body processor for `x-www-form-urlencoded` and `multipart/form-data`. Without this gate, CRS rule 901340 would force every other content type to be parsed as `URLENCODED` too, turning a binary payload into one junk `ARGS` entry per 256 bytes. |

The 128 KiB figure is enforced in application code, not by a Coraza directive — Coraza parses
`SecRequestBodyNoFilesLimit` but does not act on it
([corazawaf/coraza#896](https://github.com/corazawaf/coraza/issues/896)), which is also why that
directive doesn't appear in the block above.

A request over these limits is rejected (`SecRequestBodyLimitAction Reject`), not silently truncated
and inspected anyway.

:::note[Large binary uploads, e.g. to an S3-compatible backend]
Some backends, S3-compatible object storage in particular, accept large `application/javascript` /
`text/javascript` payloads that would otherwise hit the 128 KiB limit and CRS rule 911100 (method) /
920420 (content type). The **Uploads** toggle on a service's Manage panel (`AllowLargeJSUploads`)
exempts that one service: JavaScript-typed bodies stream to the backend unread, and `PUT`/content-type
enforcement is relaxed for it specifically. Every other header-phase rule, plus the IP/geo/bot/rate-limit
stages, still runs. Only the body-inspection gate widens, not the rest of the pipeline.
:::

## JSON request-body schema validation

A per-service **JSON Schema** can be attached to validate JSON request bodies beyond what CRS's
generic rules check. This is useful for a REST API where you already know the exact shape a valid
request body takes.

Set it from a service's Manage panel, or `POST {admin path}/services/schema/:id` with `schema` (the
JSON Schema text) and `mode`:

| Mode | Effect |
|---|---|
| `off` | Validation disabled (default). An empty schema also disables it. |
| `log` | A mismatching body is recorded in the request log but **not blocked** — use this to check a schema against real traffic before enforcing it. |
| `enforce` | A mismatching body is rejected with `400`. |

A malformed schema is rejected at save time, before it reaches the database, so a bad schema can't
later break a WAF reload. The schema is compiled once per engine build (on save, and on every
[per-service exception](#per-service-exceptions) rebuild or `SIGHUP`), never per request.

## Disabling a noisy rule

![WAF Rules page showing the Disable Rule form with CRS Rule ID and reason fields, Top Firing Rules analytics table with hit counts, and the Disabled Rules list](/img/docs/docs_waf_rules.png)

The **WAF Rules** page (`/admin/waf-rules`) lists CRS rules. Disable a rule by ID with a reason
(`POST /admin/waf-rules/disable` with `rule_id`, `reason`) and re-enable it
(`DELETE /admin/waf-rules/:id`). The WAF engine rebuilds itself from the current disabled-rule list,
so the change takes effect without a restart. See the [dashboard walkthrough](/docs/configuration/dashboard).

## Per-service exceptions

By default, disabling a rule silences it for **every** service behind the WAF. This removes coverage
from unrelated backends. For example, CRS rule `911100` ("Method
is not allowed by policy") blocks any request whose HTTP method isn't in CRS's default
`tx.allowed_methods` (`GET HEAD POST OPTIONS`), so a legitimate `PATCH`/`PUT`/`DELETE` to a REST API
gets blocked as a false positive. Disabling `911100` globally fixes that one API but also removes
HTTP-method enforcement for every other service on the WAF.

The **Scope** selector on the disable form limits an exception to a specific service. Every other
service continues enforcing the rule.

Under the hood, scoped exceptions are stored in their own table
(`waf_service_rule_exceptions`, separate from the global `waf_disabled_rules` table, since the global
table's schema allows only one row per rule ID). Any service with at least one scoped exception gets
its **own compiled Coraza engine**, combining the global disabled-rule list with that service's
exceptions. The engine is built once per reload and swapped behind the same lock as the shared
default engine. Services
with no exceptions of their own keep using the shared default engine, so this costs nothing in memory
for a deployment that never uses the feature.

A **"Per-Service Exceptions"** card on the WAF Rules page lists every scoped exception (rule ID,
service, reason, when it was added) and lets you re-enable one
(`DELETE /admin/waf-rules/service/:id`). The existing "Disabled Rules" card and the "Top Firing
Rules" table's Active/Disabled badge reflect only the **global** list. A rule scoped to one service
is still shown as active globally, which keeps global and service-specific state distinct.

You can also create a scoped exception straight from a blocked request: open it on the **Logs** page
and click **Create exception**. See [Request logs](/docs/configuration/dashboard#request-logs).

## Dry-run candidate rules

The **Dry-run Rules** card on the WAF Rules page (`POST /admin/waf-rules/dry-run`) lets you test rules
before deploying them. Paste candidate rules and replay the last N logged requests (up to 2000)
through two throwaway engines: the current global rules, and the current rules plus your candidates.
The card lists every request whose verdict would change.

Nothing is saved and live traffic is never touched.

:::note
Request bodies aren't stored in the request log, so rules that inspect bodies can't match during a
replay.
:::

## WAF detects without blocking

Make sure you're on a normal build (blocking is enabled after the CRS includes by design), and check
whether the specific rule was disabled from the dashboard.
