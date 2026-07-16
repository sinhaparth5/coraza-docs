---
sidebar_position: 1
title: Command-Line Interface
description: Runtime flags that bootstrap the server, plus the one-shot subcommands.
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
| `--db` | `waf.db` | SQLite database path. |
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
  --db /var/lib/coraza-waf-mod/waf.db \
  --certs /var/lib/coraza-waf-mod/certs \
  --retention 30
```

## Subcommands

Each subcommand does one thing and exits (it does **not** start the server).

### `setup` — seed admin credentials and optional ACME config

```bash
coraza-waf-mod setup --db waf.db --admin-email you@example.com \
  [--domain example.com] [--acme-email contact@example.com]
# Password is read from stdin (one line).
```

- **Idempotent for credentials:** if an admin already exists, the credential step is skipped — safe
  to re-run on upgrade without overwriting a changed password.
- If `--domain` is given, the domain and ACME contact email are stored so Let's Encrypt can issue a
  certificate. `--acme-email` defaults to the admin email if omitted.

### `gencert` — generate a self-signed certificate

```bash
coraza-waf-mod gencert --cert cert.pem --key key.pem \
  --hosts 203.0.113.10,waf.internal [--days 3650]
```

- Produces a self-signed **ECDSA P-256** certificate with the given hostnames/IPs as SANs (so
  browsers don't complain about a hostname mismatch on IP-based access). Pure Go — no openssl.

### `prune` — delete old request logs

```bash
coraza-waf-mod prune --db waf.db --retention 30
```

- Opens the DB, deletes request rows older than the retention window **in batches** (with short
  pauses between batches so SQLite's single write lock isn't held for the whole delete), and exits.
- `--retention 0` or negative disables pruning. Intended to be run by cron or the bundled systemd
  timer, never inside the live server process. See [Log Retention & Pruning](/docs/configuration/log-retention).

### `version`

```bash
coraza-waf-mod version        # or: coraza-waf-mod --version
```
