---
sidebar_position: 4
title: Running as a systemd Service
description: The systemd unit the installer writes, and common service operations.
---


The installer writes `/etc/systemd/system/coraza-waf-mod.service` similar to:

```ini
[Unit]
Description=Coraza WAF Mod (WAF + reverse proxy)
After=network.target

[Service]
Type=simple
User=coraza-waf-mod
Group=coraza-waf-mod
WorkingDirectory=/var/lib/coraza-waf-mod
ExecStart=/usr/local/bin/coraza-waf-mod --listen :80 --listen-tls :443 \
  --db /var/lib/coraza-waf-mod/waf.db --certs /var/lib/coraza-waf-mod/certs --retention 30
Restart=on-failure
RestartSec=5s

# Bind :80/:443 without running as root
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
ProtectSystem=full
PrivateTmp=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

Common operations:

```bash
sudo systemctl status coraza-waf-mod        # status
sudo systemctl restart coraza-waf-mod       # restart (e.g. after changing flags)
sudo journalctl -u coraza-waf-mod -f        # follow logs
sudo systemctl list-timers | grep coraza    # see the prune timer
```

To change flags (listen addresses, trusted proxies, retention), edit the `ExecStart` line, then
`sudo systemctl daemon-reload && sudo systemctl restart coraza-waf-mod`.
