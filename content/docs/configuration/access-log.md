---
sidebar_position: 6
title: Access Log
description: An optional nginx-combined-format access log file, plus a live terminal view in the dashboard.
---


Coraza WAF Mod can write an **nginx-combined-format** access log to a plain text file independently
of the SQLite-backed request log. This supports tools such as `fail2ban`, log shippers, `grep`/`awk`,
and `logrotate`-style pipelines.

## Enabling it

It's **opt-in**, off by default:

```bash
./coraza-waf-mod --access-log /var/log/coraza-waf-mod/access.log
```

| Flag | Default | Description |
|---|---|---|
| `--access-log` | *(empty)* | File path. Empty disables the writer entirely. |
| `--access-log-max-size-mb` | `100` | Rotate after the file reaches this size. |
| `--access-log-max-backups` | `5` | How many rotated files (`access.log.1`, `.2`, …) to keep before the oldest is pruned. |

The built-in writer handles rotation. The SQLite log follows the same approach through
`coraza-waf-mod prune` and a systemd timer, so neither log requires an external rotation tool.

## Format notes

Each line follows the standard nginx combined log format. Two fields don't apply to this project and
render as the conventional `-` placeholder rather than a fabricated value: response byte count and
the `Referer` header aren't tracked on the underlying request-log row (the same placeholder every
combined-format line already uses for the identd/userid fields).

## Live terminal view in the dashboard

The **Logs** page (`/admin/logs`) has a **Table / Terminal** toggle. Terminal mode shows a
dark, monospace panel of raw access-log lines streamed live over SSE
(`GET /admin/access-log/stream`). It works **regardless of whether `--access-log` is set** because it
reads the same in-memory broadcast as the file writer rather than reading the file.

- Only one SSE connection is open at a time. Switching Table ↔ Terminal closes the active stream and
  opens the other.
- The panel **preloads the last 24 hours** of history on page load rather than starting empty.
- Lines are inserted as plain text (never HTML) since `Path` and `User-Agent` are attacker-controlled,
  and the panel caps at the last 100 lines.
- Long lines **scroll horizontally** instead of wrapping, like a real terminal.
- Auto-scroll-to-newest continues only while you're at or near the bottom. Scrolling up to read
  history pauses it independently of the manual Pause button.
