---
sidebar_position: 6
title: Building & Releasing
description: Make targets for building, testing, cross-compiling, and tagging releases.
---


```bash
make build       # go generate (minify JS) + go build → ./coraza-waf-mod
make run         # build + run
make test        # go test ./...
make clean       # remove binary, minified JS, dist/
make dist        # cross-compile linux/amd64 + linux/arm64 + windows/amd64 (CGO_ENABLED=0)
make checksums   # sha256sum dist/* → dist/checksums.txt
make tag VERSION=v1.0.0   # annotated git tag + push (triggers the GitLab release pipeline)
```

Run a single package's tests:

```bash
go test ./proxy/ -run TestName -v
```

:::warning[Always use make build after editing JS]
Never run bare `go build` after editing JavaScript in `static/js/src/*.js` — the minifier runs via
`go generate`, which `make build` triggers but `go build` does not. Use `make build`, or run
`go generate ./...` first.
:::
