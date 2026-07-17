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
SecRequestBodyNoFilesLimit 131072
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

## WAF detects without blocking

Make sure you're on a normal build (blocking is enabled after the CRS includes by design), and check
whether the specific rule was disabled from the dashboard.
