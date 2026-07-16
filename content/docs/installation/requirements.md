---
sidebar_position: 1
title: Requirements
description: Supported operating systems, architectures, privileges, and build prerequisites.
---


| | |
|---|---|
| **OS (running)** | Linux (the installer and systemd units are Linux-only). Windows binaries can be built but the installer does not target them. |
| **Architecture** | `amd64` (x86_64) or `arm64` (aarch64). |
| **Privileges** | Root (via `sudo`) only to install the systemd service and bind ports 80/443. The service itself runs as a dedicated non-root user. |
| **Go (building only)** | Go **1.25+**. Not needed if you use a release binary. |
| **External services** | None required. Redis is optional (only for multi-node rate limiting). |

Everything — SQLite driver (`modernc.org/sqlite`), GeoIP, ASN — is pure Go, so binaries are built
with `CGO_ENABLED=0` and run with no shared-library dependencies.
