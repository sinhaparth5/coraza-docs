---
sidebar_position: 5
title: Upgrading
description: Upgrade-aware installer re-run, and the source-build upgrade path.
---


Re-run the installer — it is upgrade-aware:

```bash
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo bash
```

On an existing install it downloads + verifies the new binary, replaces it, and restarts the
service. **Admin credentials and certificates are never overwritten on upgrade** (the `setup` step
is idempotent for credentials). Pin a version with:

```bash
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo CORAZA_VERSION=v1.2.3 bash
```

For source installs, `git pull && make build`, then restart the service/process.
