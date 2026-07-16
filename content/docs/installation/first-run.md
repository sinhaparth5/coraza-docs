---
sidebar_position: 3
title: First Run & Initial Setup
description: Seed the first admin account, start the server, and open the dashboard.
---


If you used the **installer (Option A)**, your admin account already exists (you typed it during
install) and the service is running — skip to [Using the Dashboard](/docs/configuration/dashboard).

For a **manual / source install**:

1. **Create the first admin account:**
   ```bash
   printf 'your-strong-password\n' | ./coraza-waf-mod setup \
     --db ./waf.db --admin-email you@example.com
   ```
   :::warning[Default dev credentials are insecure]
   If you start the server **without** running `setup`, a development fallback admin
   (`admin@localhost` / `admin123`) is seeded and printed in the logs. **Do not rely on this in
   production** — always run `setup` to create real credentials and change the default.
   :::
2. **Start the server:**
   ```bash
   ./coraza-waf-mod --db ./waf.db --listen :8080
   ```
3. **Open the dashboard** at `http://<host>:8080/admin` and log in.
4. **Add your first backend** under **Services** (see [Using the Dashboard](/docs/configuration/dashboard)).
