---
sidebar_position: 6
title: FAQ
description: Frequently asked questions about Docker, databases, geo data, config files, scaling, and credentials.
---


**Do I need Docker?** No. A `Dockerfile` and `docker-compose.yml` exist for container-based local
development, but the primary distribution is a native binary + systemd.

**Do I need a database server?** No. All state is in a single SQLite file. Redis is optional and only
for multi-node rate limiting.

**Do I need a MaxMind account for geo blocking?** No. A GeoLite2-Country database is bundled. You can
optionally override it with a freshly downloaded `.mmdb` via `--geo-db`.

**Is there a config file?** Not for the running server — it's configured by CLI flags plus the
dashboard/database. (Older docs referencing `config.yaml` predate the move to flags.)

**Can I run multiple instances?** Yes, behind a load balancer. Use the **Redis** rate-limit backend
so the instances share one rate-limit view, and set `--trusted-proxies` to the load balancer's CIDR.

**Can I disable a WAF rule for just one backend?** Yes — the disable form on the **WAF Rules** page
has a **Scope** selector; pick a service instead of Global. See
[Per-service exceptions](/docs/security/waf#per-service-exceptions).

**Where does it store data?** The SQLite DB at `--db` (installer: `/var/lib/coraza-waf-mod/waf.db`)
and TLS files under `--certs` (installer: `/var/lib/coraza-waf-mod/certs`).

**How do I reset the admin password?** Re-running `coraza-waf-mod setup` is idempotent and won't
overwrite an existing password; change it from **Settings** in the dashboard instead. (If locked out,
credentials live in the `waf.db` meta table.)
