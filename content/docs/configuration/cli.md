---
sidebar_position: 1
title: Command-Line Interface
description: Runtime flags that bootstrap the server, plus the one-shot subcommands.
keywords: [cli, command line flags, db-driver, build-dsn, setup, prune, gencert]
---


The binary is configured entirely through **CLI flags** (bootstrap settings) plus the **admin
dashboard / database** (everything runtime). There is no longer a `config.yaml` that the running
server reads — all knobs are flags or DB-managed.

## Runtime flags

Start the WAF/proxy/dashboard by running the binary with any of these flags:

| Flag | Default | Description |
|---|---|---|
| `--listen` | `:8080` | HTTP listen address. |
| `--listen-tls` | *(empty)* | HTTPS listen address. Empty = HTTP only. |
| `--trusted-proxies` | *(empty)* | Comma-separated CIDRs allowed to supply `X-Forwarded-For` / `X-Real-IP`. |
| `--db` | `waf.db` | SQLite path, MySQL DSN, or Postgres connection URL/DSN. |
| `--db-driver` | `sqlite` | Database backend: `sqlite`, `mysql`/`mariadb`, or `postgres` plus the `postgresql`, `cockroachdb`, and `neon` aliases. |
| `--db-key-file` | *(empty)* | File containing at least 32 bytes of high-entropy key material (raw, hex, or base64) used to encrypt stored secrets with AES-256-GCM. Empty keeps secrets plaintext. |
| `--certs` | `./certs` | TLS certificate cache directory (Let's Encrypt files). |
| `--waf-rules` | *(empty)* | Directory of extra `.conf` WAF rules, loaded on top of OWASP CRS. |
| `--geo-db` | *(empty)* | Path to an external `GeoLite2-Country.mmdb`. Empty = use bundled DB. |
| `--retention` | `30` | Request-log retention in days. `0` = keep forever (used by `prune`). |
| `--tls-cert` | *(empty)* | PEM certificate file for the HTTPS fallback (self-signed). |
| `--tls-key` | *(empty)* | Matching PEM private key for `--tls-cert`. |
| `--access-log` | *(empty)* | nginx-combined-format access log file path. Empty = disabled. See [Access Log](/docs/configuration/access-log). |
| `--access-log-max-size-mb` | `100` | Rotate the access log after it reaches this many MB. |
| `--access-log-max-backups` | `5` | Number of rotated access log files (`access.log.1`, `.2`, …) to keep. |

Example (HTTP + HTTPS, behind a known load balancer):

```bash
./coraza-waf-mod \
  --listen :80 \
  --listen-tls :443 \
  --tls-cert /var/lib/coraza-waf-mod/certs/self-signed.crt \
  --tls-key  /var/lib/coraza-waf-mod/certs/self-signed.key \
  --trusted-proxies 10.0.0.0/8,192.168.0.0/16 \
  --db-driver sqlite \
  --db /var/lib/coraza-waf-mod/waf.db \
  --db-key-file /etc/coraza-waf-mod/db.key \
  --certs /var/lib/coraza-waf-mod/certs \
  --retention 30
```

## Subcommands

Each subcommand does one thing and exits (it does **not** start the server).

### `setup` — seed admin credentials and optional ACME config

```bash
coraza-waf-mod setup --db-driver sqlite --db waf.db --admin-email you@example.com \
  [--domain example.com] [--acme-email contact@example.com]
# Password is read from stdin (one line).
```

- **Idempotent for credentials:** if an admin already exists, the credential step is skipped — safe
  to re-run on upgrade without overwriting a changed password.
- If `--domain` is given, the domain and ACME contact email are stored so Let's Encrypt can issue a
  certificate. `--acme-email` defaults to the admin email if omitted.
- Use the same `--db-driver` and `--db` values that the server will use. Supported driver aliases are
  the same as the runtime flags.

### `gencert` — generate a self-signed certificate

```bash
coraza-waf-mod gencert --cert cert.pem --key key.pem \
  --hosts 203.0.113.10,waf.internal [--days 3650]
```

- Produces a self-signed **ECDSA P-256** certificate with the given hostnames/IPs as SANs (so
  browsers don't complain about a hostname mismatch on IP-based access). Pure Go — no openssl.

### `prune` — delete old request logs

```bash
coraza-waf-mod prune --db-driver sqlite --db waf.db --retention 30 --vacuum
```

- Opens the DB, deletes expired sessions and request rows older than the retention window **in
  batches**, and exits.
- `--vacuum` reclaims space after deletion. SQLite runs a full rebuild plus WAL truncate and reports
  before/after size; Postgres runs its in-place `VACUUM`; MySQL treats the flag as a documented no-op.
- `--retention 0` or negative disables pruning. Intended to be run by cron or the bundled systemd
  timer, never inside the live server process. See [Log Retention & Pruning](/docs/configuration/log-retention).

### `build-dsn` — safely construct an external database DSN

```bash
printf '%s\n' "$DB_PASSWORD" | coraza-waf-mod build-dsn \
  --driver postgres --host db.example.com --port 5432 \
  --username coraza --dbname coraza --sslmode require
```

The command prints a driver-correct DSN with credentials escaped safely. The password is read from
stdin (an empty line is allowed), never from a flag. Optional `--extra` accepts query parameters such
as `connect_timeout=10&application_name=coraza`. MySQL defaults to port `3306`; Postgres defaults to
`5432`.

### `version`

```bash
coraza-waf-mod version        # or: coraza-waf-mod --version
```
