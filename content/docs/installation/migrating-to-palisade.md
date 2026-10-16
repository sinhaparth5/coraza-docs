---
sidebar_position: 6
title: Migrating from coraza-waf-mod (2.4.x → 2.5.0)
description: Move a 2.4.x coraza-waf-mod install to Palisade 2.5.0 without losing the database, certificates, encryption key, or settings.
keywords: [migration, rename, coraza-waf-mod, palisade, 2.5.0, upgrade, coraza_version]
---


Version 2.5.0 renamed the product from coraza-waf-mod to Palisade. For a native install, re-running the
**v2.5.0** installer does the 2.4.x → 2.5.0 migration for you. Your database, certificates, encryption key,
and settings are moved to the new paths, not recreated.

:::warning[Go through 2.5.0 first]
Don't jump straight from 2.4.x to the current installer. It only handles v2.5.1+, no longer contains the
migration code, and would set up a new, empty install next to the old one. Migrate to 2.5.0, then
[upgrade normally](/docs/installation/upgrading).
:::

## Native install (systemd, from `install.sh`)

### 1. Back up (optional, but cheap)

```bash
sudo systemctl stop coraza-waf-mod
sudo tar czf ~/coraza-backup-$(date +%F).tgz /var/lib/coraza-waf-mod /etc/coraza-waf-mod
sudo systemctl start coraza-waf-mod
```

### 2. Run the v2.5.0 installer, pinned to that version

```bash
curl -fsSL https://raw.githubusercontent.com/sinhaparth5/coraza-waf-mod/v2.5.0/deploy/install.sh \
  | sudo CORAZA_VERSION=v2.5.0 bash
```

Use the script from the `v2.5.0` tag. The pin variable for that version is `CORAZA_VERSION` (it became
`PALISADE_VERSION` later).

What the script does:

1. Sees `/usr/local/bin/coraza-waf-mod` and treats the run as an upgrade.
2. Reads `--db-driver` and `--db` from your old unit, so MySQL or Postgres setups keep their DSN.
3. Downloads the `coraza-waf-mod-linux-<arch>` asset, checks its SHA256, and installs it as
   `/usr/local/bin/palisade`.
4. Stops and disables `coraza-waf-mod.service` and `coraza-waf-mod-prune.timer`.
5. Moves these directories:

   | From | To | Contains |
   | --- | --- | --- |
   | `/var/lib/coraza-waf-mod` | `/var/lib/palisade` | DB, certs |
   | `/etc/coraza-waf-mod` | `/etc/palisade` | `db.key` |
   | `/var/log/coraza` | `/var/log/palisade` | `access.log` |

6. Renames the `coraza-waf-mod` user and group to `palisade`. The uid stays the same, so file ownership
   still works.
7. Removes the old binary, the old units, and the Varnish override `coraza.conf`.
8. Writes `palisade.service`, the prune timer, and the Varnish `palisade.conf`, then starts the service.

### 3. Check it

```bash
sudo systemctl status palisade
palisade --version          # v2.5.0
ls /var/lib/palisade /etc/palisade
curl -sI http://127.0.0.1:8080/_cz/healthz | grep -i server   # Server: Palisade
```

## Things you must update by hand

- **Prometheus:** metrics are now `palisade_*` instead of `coraza_*`. Update your Grafana dashboards and
  alert rules. (The 2.5.0 changelog wrongly says metric names didn't change. They did.)
- **Log consumers:** point fail2ban, GoAccess, or log shippers at `/var/log/palisade/access.log`.
- **`X-WAF-Engine` header:** anything that matches it needs updating; it now reads `Palisade`.
- **Clusters with shared Redis:** the blocklist channel is now `palisade:ipblocklist:reload`. During a
  rolling upgrade, nodes on different versions won't sync blocklist reloads, so upgrade all nodes together.
- **Your own scripts:** change `systemctl … coraza-waf-mod` to `palisade`, and
  `/usr/local/bin/coraza-waf-mod` to `/usr/local/bin/palisade`.
- **Backups** now download as `palisade-YYYY-MM-DD.db`. This is cosmetic.

## Docker

The image entrypoint changed from `/coraza-waf-mod` to `/palisade`. The `/data` volume layout is the same,
so just swap the tag:

```bash
docker pull ghcr.io/sinhaparth5/coraza-waf-mod:2.5.0
docker stop coraza-waf && docker rm coraza-waf
docker run -d --name palisade -p 8080:8080 -v coraza-waf-data:/data ghcr.io/sinhaparth5/coraza-waf-mod:2.5.0
```

If your compose file or `docker run` overrides `entrypoint:` or the healthcheck command with
`/coraza-waf-mod`, change it to `/palisade`.

## Rollback

```bash
sudo systemctl disable --now palisade palisade-prune.timer
# restore the tarball from step 1, then reinstall 2.4.1:
curl -fsSL https://raw.githubusercontent.com/sinhaparth5/coraza-waf-mod/v2.4.1/deploy/install.sh \
  | sudo CORAZA_VERSION=v2.4.1 bash
```

## Going past 2.5.0

Once you're on 2.5.0, the regular installer upgrades you the rest of the way:

```bash
curl -fsSL https://waf-install.astrareconslabs.com/palisade-waf/install.sh | sudo bash
```
