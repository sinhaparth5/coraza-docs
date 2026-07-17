---
sidebar_position: 1
title: Requirements
description: Supported operating systems, architectures, privileges, and build prerequisites.
keywords: [requirements, linux, amd64, arm64, go 1.25, system requirements]
---


| | |
|---|---|
| **OS (running)** | Linux (the installer and systemd units are Linux-only). Windows binaries can be built but the installer does not target them. |
| **Architecture** | `amd64` (x86_64) or `arm64` (aarch64). |
| **Privileges** | Root (via `sudo`) only to install the systemd service and bind ports 80/443. The service itself runs as a dedicated non-root user. |
| **Go (building only)** | Go **1.25+**. Not needed if you use a release binary. |
| **External services** | None required. Redis is optional for multi-node rate limiting; MySQL/MariaDB or a Postgres-compatible database can optionally replace SQLite. |

The SQLite, MySQL, and Postgres drivers, plus GeoIP and ASN, are pure Go. Release binaries use
`CGO_ENABLED=0` and need no shared libraries.
