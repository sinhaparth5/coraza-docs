---
sidebar_position: 6
title: FAQ
description: Frequently asked questions about Docker, databases, geo data, config files, scaling, and credentials.
keywords: [faq, frequently asked questions, docker, database, config file]
---


**Do I need Docker?** No. Native binary + systemd installation remains supported. A published
multi-architecture image is also available from GHCR for container deployments.

**Do I need a database server?** No. SQLite is the default. MySQL/MariaDB and Postgres-compatible
servers are optional alternatives; Redis is separate and only provides shared rate-limit state.

**Do I need a MaxMind account for geo blocking?** No. A GeoLite2-Country database is bundled. You can
optionally override it with a freshly downloaded `.mmdb` via `--geo-db`.

**Is there a config file?** Not for the running server — it's configured by CLI flags plus the
dashboard/database. (Older docs referencing `config.yaml` predate the move to flags.)

**Can I run multiple instances?** Yes, behind a load balancer. Use an external database for shared
state, Redis for a shared rate-limit view, and set `--trusted-proxies` to the load balancer's CIDR.
Dashboard-triggered in-memory reloads affect only the node handling that request, so reload or
restart peer nodes after configuration changes.

**Can I manage services/IP rules without the dashboard UI?** Yes — a bearer-token-authenticated
[REST API](/docs/configuration/rest-api) at `/admin/api/v1` covers services, IP rules, and bans, for
scripting and CI integrations. Create a key from **Settings → API Keys**.

**Can I disable a WAF rule for just one backend?** Yes — the disable form on the **WAF Rules** page
has a **Scope** selector; pick a service instead of Global. See
[Per-service exceptions](/docs/security/waf#per-service-exceptions).

**Where does it store data?** In the backend selected by `--db-driver` and `--db`; the installer
defaults to `/var/lib/coraza-waf-mod/waf.db`. TLS files live under `--certs`. Installer-managed
secrets use `/etc/coraza-waf-mod/db.key`, which must be backed up separately from the data directory.

**How do I reset the admin password?** Re-running `coraza-waf-mod setup` is idempotent and won't
overwrite an existing password. Change it from **Settings** while signed in. There is currently no
password-reset subcommand; a lockout requires restoring a known-good database backup or deliberate
database-administrator recovery of the `admin_password_hash` meta value.
