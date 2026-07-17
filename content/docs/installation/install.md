---
sidebar_position: 2
title: Installation
description: Four ways to install — the one-line installer, building from source, pre-built release binaries, or the published Docker image.
keywords: [installation, install script, docker, systemd, ghcr, one-line installer]
---


## Option A — One-line installer

```bash
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo bash
```

The installer is **interactive** (it prompts for admin credentials, HTTPS setup, and an optional
external database).

What the installer does:

1. Detects your OS and CPU architecture (`amd64`/`arm64`).
2. Detects the **latest GitHub release** (or honors a pinned `CORAZA_VERSION`).
3. **Downloads the matching binary and `checksums.txt`, then verifies the SHA-256 checksum** before
   installing to `/usr/local/bin/coraza-waf-mod`.
4. Prompts interactively for:
   - **Admin email** and **password** (entered twice).
   - An optional **domain name** — if given, Let's Encrypt is used; if blank, a self-signed cert is
     generated for the server's public IP.
   - An optional external **MySQL/MariaDB or Postgres-compatible database**. SQLite remains the
     default.
5. Creates a dedicated non-root system user `coraza-waf-mod` (with only `CAP_NET_BIND_SERVICE`, so
   it can bind 80/443 without being root).
6. Creates `/var/lib/coraza-waf-mod/` (data + certs), seeds admin credentials into the database via
   the `setup` subcommand, and generates a self-signed cert via `gencert` when no domain is given.
   It also creates `/etc/coraza-waf-mod/db.key` at mode `0400` and enables secrets-at-rest
   encryption. Existing keys are never replaced during upgrades.
7. Installs and starts three systemd units: the main service, plus a **prune service + timer**
   (log retention and backend-aware vacuuming, runs every 15 days).

Useful environment overrides:

```bash
# Pin a specific version
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo CORAZA_VERSION=v1.0.0 bash

# Private GitHub repository — supply a personal access token
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo GITHUB_TOKEN=github_pat_xxxxxxxx bash

# Dry run — print every action, write nothing (no root needed)
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | DRY_RUN=1 bash
```

After it finishes:

```bash
sudo systemctl status coraza-waf-mod      # is it running?
sudo journalctl -u coraza-waf-mod -f      # follow logs
```

The dashboard is then reachable at **`https://<your-domain-or-server-ip>/admin`**. With a
self-signed certificate, your browser will show a security warning the first time — accept the
exception. You can later switch to a trusted certificate from **Settings → TLS**.

## Option B — Build from source

Requires Go 1.25+.

```bash
git clone https://github.com/sinhaparth5/coraza-waf-mod.git
cd coraza-waf-mod
make build          # runs `go generate` (minifies JS) then `go build` → ./coraza-waf-mod
```

Then seed an admin account and start it:

```bash
# Create the first admin (reads the password from stdin)
printf 'your-strong-password\n' | ./coraza-waf-mod setup \
  --db ./waf.db --admin-email you@example.com

# Start the WAF + proxy on :8080
./coraza-waf-mod --db ./waf.db --listen :8080
```

:::warning[Build note]
Never run bare `go build` after editing JavaScript in `static/js/src/*.js` — the minifier runs via
`go generate`, which `make build` triggers but `go build` does not. Use `make build`, or run
`go generate ./...` first.
:::

## Option C — Pre-built release binaries

```bash
make dist          # cross-compiles linux/amd64, linux/arm64, windows/amd64 (CGO_ENABLED=0)
make checksums     # writes dist/checksums.txt
```

The binaries land in `dist/`. Copy the one for your platform, mark it executable, and run it the
same way as Option B.

## Option D — Published Docker image

Release images are published for `linux/amd64` and `linux/arm64` at
`ghcr.io/sinhaparth5/coraza-waf-mod`, tagged with the release version and `latest`. Persistent state
lives under `/data`.

```bash
# One-time admin setup; type the password followed by Enter.
docker run --rm -it -v coraza-waf-data:/data \
  ghcr.io/sinhaparth5/coraza-waf-mod:latest \
  setup --db /data/waf.db --admin-email you@example.com

# Start the server using the image defaults: :8080, /data/waf.db, /data/certs.
docker run -d --name coraza-waf-mod -p 8080:8080 \
  -v coraza-waf-data:/data \
  ghcr.io/sinhaparth5/coraza-waf-mod:latest
```

The minimal image includes CA certificates for ACME, threat-intel downloads, email, and webhooks.
Mount a separate file containing at least 32 bytes of high-entropy key material and pass
`--db-key-file` if you want secrets-at-rest encryption; the container does not generate that key
automatically.
