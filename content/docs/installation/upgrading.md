---
sidebar_position: 5
title: Upgrading
description: Upgrade-aware installer re-run, and the source-build upgrade path.
keywords: [upgrade, update, version pinning, coraza_version]
---


Re-run the installer — it is upgrade-aware:

```bash
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo bash
```

On an existing install it downloads + verifies the new binary, replaces it, rewrites the units, and
restarts the service. **Admin credentials, certificates, the encryption key, and the selected
database backend are preserved on upgrade.** Pin a version with:

```bash
curl -fsSL https://waf-install.astrareconslabs.com/coraza-waf-mod/install.sh | sudo CORAZA_VERSION=v1.2.3 bash
```

For source installs, `git pull && make build`, then restart the service/process.
