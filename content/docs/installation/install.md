---
sidebar_position: 2
title: Installation
description: Three ways to install — the one-line installer, building from source, or pre-built release binaries.
---


## Option A — One-line installer

```bash
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo bash
```

The installer is **interactive** (it prompts for admin email, password, and an optional domain).

What the installer does:

1. Detects your OS and CPU architecture (`amd64`/`arm64`).
2. Detects the **latest release** from GitLab (or honors a pinned `CORAZA_VERSION`).
3. **Downloads the matching binary and `checksums.txt`, then verifies the SHA-256 checksum** before
   installing to `/usr/local/bin/coraza-waf-mod`.
4. Prompts interactively for:
   - **Admin email** and **password** (entered twice).
   - An optional **domain name** — if given, Let's Encrypt is used; if blank, a self-signed cert is
     generated for the server's public IP.
5. Creates a dedicated non-root system user `coraza-waf-mod` (with only `CAP_NET_BIND_SERVICE`, so
   it can bind 80/443 without being root).
6. Creates `/var/lib/coraza-waf-mod/` (data + certs), seeds admin credentials into the database via
   the `setup` subcommand, and generates a self-signed cert via `gencert` when no domain is given.
7. Installs and starts three systemd units: the main service, plus a **prune service + timer**
   (log retention, runs every 15 days).

Useful environment overrides:

```bash
# Pin a specific version
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo CORAZA_VERSION=v1.0.0 bash

# Private GitLab project — supply a personal access token
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo GITLAB_TOKEN=glpat-xxxxxxxx bash

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
git clone https://gitlab.com/sinhaparth5/coraza-waf-mod.git
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
