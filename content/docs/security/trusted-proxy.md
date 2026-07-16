---
sidebar_position: 6
title: Trusted Proxy & Real Client IP
description: How the real client IP is resolved for blocking, geo, rate limiting, and logging — and why forwarded headers are not trusted by default.
---


The client IP used for blocklist, geo, rate limiting, and logging is resolved by precedence:

1. `CF-Connecting-IP` — **only** when the socket peer is in Cloudflare's published ranges.
2. `X-Forwarded-For` / `X-Real-IP` — **only** when the socket peer is in a configured trusted-proxy
   CIDR (`--trusted-proxies`).
3. Otherwise, the **raw socket peer address**.

**Forwarded headers are never trusted by default.** Without `--trusted-proxies`, a direct client
cannot forge its source IP to evade IP/geo blocks or reset its rate-limit bucket.

:::warning[All clients showing the same IP?]
If all clients appear to share one IP (and rate limiting blocks everyone), you're likely behind a
proxy or load balancer but haven't set `--trusted-proxies`, so the real client IP isn't being read
from `X-Forwarded-For`. Add the proxy's CIDR to `--trusted-proxies`. Conversely, if you set
`--trusted-proxies` too broadly while directly internet-facing, clients could spoof their IP — only
list CIDRs you actually trust.
:::
