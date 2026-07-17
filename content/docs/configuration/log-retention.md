---
sidebar_position: 5
title: Log Retention & Pruning
description: How request logs are pruned by a separate one-shot command or the bundled systemd timer.
keywords: [log retention, pruning, request logs, systemd timer]
---


Request logs accumulate in SQLite. Pruning is **not** automatic inside the running server; it is a
separate one-shot command so a multi-second delete never shares the live process's DB connection
pool with request traffic.

Run it from cron or the bundled systemd timer:

```bash
coraza-waf-mod prune --db /var/lib/coraza-waf-mod/waf.db --retention 30
```

The installer sets up `coraza-waf-mod-prune.service` + `.timer` to run every 15 days automatically.
Deletes happen in batches (2000 rows) with short pauses, so SQLite's single write lock isn't held
for the entire operation.

The retention window is also expressible at runtime via the `--retention` flag (days; `0` = keep
forever). See the [CLI reference](/docs/configuration/cli) for the `prune` subcommand.
