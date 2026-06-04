---
name: hiui
description: >
  Use when the user's task involves HiUI (@hi-ui/*) — writing HiUI components,
  debugging HiUI issues, querying HiUI props/docs, migrating from HiUI V4 to V5,
  or setting up React 19 compatibility with @hi-ui/patch-for-react. Triggers on
  imports from '@hi-ui/*', hi-ui/hiui mentions, or explicit HiUI questions.
allowed-tools:
  - Bash(hiui *)
  - Bash(npm install -g @hi-ui/hiui-cli*)
  - Bash(which hiui)
---

# HiUI CLI

You have access to `@hi-ui/hiui-cli` — a CLI for querying HiUI component documentation and automating common upgrade tasks. Component docs are fetched from official [llms](https://xiaomi.github.io/hiui/llms/alert.md) endpoints (network required for `list` / `doc` / `info` / `url`). Migration and React 19 patch setup run locally on the project filesystem.

## Setup

Before first use, check if the CLI is installed. If not, install it:

```bash
which hiui || npm install -g @hi-ui/hiui-cli
hiui version
```

The `hiui` command comes from the globally installed `@hi-ui/hiui-cli` package.

**Always use `--format json` for structured output you can parse programmatically.**

## Scenarios

### 1. Writing HiUI component code

Before writing any HiUI component code, look up its API first — don't rely on memory.

```bash
# Check available props
hiui info Button --format json

# Full docs with usage examples (TSX demos in markdown)
hiui doc Button --format json

# Get the canonical llms URL for citations
hiui url Button --format json
```

**Workflow:** `hiui info` → understand props → `hiui doc` → read examples → write code.

HiUI packages use kebab-case names (`@hi-ui/date-picker`). Component CLI args accept `Button`, `datePicker`, or `date-picker` (auto-normalized to kebab-case).

**Import patterns:**

```tsx
// Full bundle
import { Button, Input } from '@hi-ui/hiui'

// Per-component (recommended for existing apps)
import Button from '@hi-ui/button'
import Input from '@hi-ui/input'
import { InfoCircleFilled } from '@hi-ui/icons'
```

### 2. Looking up full documentation

When you need comprehensive component docs (not just props):

```bash
hiui doc Table --format json
```

Markdown includes description, usage examples, and props tables. Source: `https://xiaomi.github.io/hiui/llms/<component>.md`.

### 3. Exploring available components

When choosing which component to use:

```bash
hiui list --format json
```

Index is derived from [llms.txt](https://xiaomi.github.io/hiui/llms.txt). For offline context, you can also reference [llms-full.txt](https://xiaomi.github.io/hiui/llms-full.txt).

### 4. Migrating HiUI V4 → V5

When upgrading a project from HiUI 4.x to 5.x:

```bash
# Preview changes (no writes)
hiui migrate 4 5 --dry-run --format json

# Apply to current directory
hiui migrate 4 5 --format json

# Monorepo sub-app
hiui migrate 4 5 --path ./apps/web --format json

# Only bump @hi-ui/* in package.json
hiui migrate 4 5 --deps-only

# Only replace .hi-v4 / hi-v4- class prefixes
hiui migrate 4 5 --class-only
```

**What `migrate 4 5` does:**

1. Sets `@hi-ui/*` in all `package.json` files to `^5.0.0` (excludes tooling like `@hi-ui/hi-build`)
2. Replaces `.hi-v4` → `.hi-v5` and `hi-v4-` → `hi-v5-` in project source/styles

**What it does NOT do:** API breaking changes, import path refactors, or business logic. After migrate, run `npm install` or `yarn`, then fix remaining issues manually. See project migration docs.

**Workflow:** `hiui migrate 4 5 --dry-run` → review → `hiui migrate 4 5` → install deps → `hiui doc` / `hiui info` per changed component → fix API usage.

Currently only `4 → 5` is supported; other version pairs return `UNSUPPORTED_MIGRATION`.

### 5. React 19 compatibility

When the project uses React 19 and needs `ReactDOM.render` / legacy static APIs patched for HiUI:

```bash
hiui patch-for-react --dry-run --format json
hiui patch-for-react --path . --format json
hiui patch-for-react --entry src/index.tsx --skip-install
```

**What it does:**

1. Adds `@hi-ui/patch-for-react` to `dependencies` (`^5.0.0` by default, override with `--patch-version`)
2. Inserts `import '@hi-ui/patch-for-react'` at the top of the entry file (after `'use client'` if present)
3. Runs `npm` / `yarn` / `pnpm install` unless `--skip-install`

Entry auto-detection: `src/index.tsx`, `src/main.tsx`, etc., or script `src` from `index.html`.

### 6. Customizing docs source

When using a mirror or internal docs host:

```bash
hiui doc alert --base-url https://xiaomi.github.io/hiui --format json
# or
HIUI_DOCS_BASE_URL=https://your-mirror.example hiui list --format json
```

### 7. Semantic classNames / styles

Many HiUI 5 components support `classNames` and `styles` for per-element styling. Check the **Semantic** example in component docs:

```bash
hiui doc Alert --format json
```

Look for `classNames` / `styles` usage in the markdown examples.

### 8. Alternative: LLMs.txt without CLI

If the CLI is unavailable, fetch docs directly:

- Index: https://xiaomi.github.io/hiui/llms.txt
- Full: https://xiaomi.github.io/hiui/llms-full.txt
- Per component: https://xiaomi.github.io/hiui/llms/`<component>`.md

## Global Flags

| Flag | Purpose |
| --- | --- |
| `--format json` | Structured JSON output (agents should prefer this) |
| `--base-url <url>` | Docs root (default: `https://xiaomi.github.io/hiui`) |
| `--timeout <ms>` | HTTP timeout for doc fetch (default: `30000`) |
| `-V, --version` | Print CLI version (`hiui version` also works) |

### `migrate` options

| Flag | Purpose |
| --- | --- |
| `--path <dir>` | Project root (default: `.`) |
| `--dry-run` | Preview without writing |
| `--deps-only` | Only update package.json |
| `--class-only` | Only replace class name prefixes |

### `patch-for-react` options

| Flag | Purpose |
| --- | --- |
| `--path <dir>` | Project root |
| `--entry <file>` | Explicit entry file |
| `--dry-run` | Preview only |
| `--skip-install` | Skip package manager install |
| `--patch-version <range>` | Version for `@hi-ui/patch-for-react` (default: `^5.0.0`) |

## Key Rules

1. **Always query before writing** — Don't guess HiUI APIs from memory. Run `hiui info` or `hiui doc` first.
2. **Use `--format json`** — Parse JSON output instead of regex-matching plain text.
3. **Prefer `hiui doc` for examples** — Demos live inside markdown; there is no separate `hiui demo` command yet.
4. **Migrate with preview** — Run `hiui migrate 4 5 --dry-run` before applying; then install deps and fix API changes manually.
5. **React 19 patch is entry-level** — `patch-for-react` only adds the side-effect import; ensure it runs before other app imports.
6. **Component names are kebab-case in packages** — CLI normalizes `CheckSelect` → `check-select` for URLs and docs.
7. **Network for docs commands** — `list`, `doc`, `info`, `url` need HTTP access to the llms host; migrate and patch-for-react are offline filesystem operations.

## Command Reference

| Command | Description |
| --- | --- |
| `hiui version` | CLI version |
| `hiui list` | All components from llms.txt |
| `hiui info <component>` | Props API |
| `hiui doc <component>` | Full markdown documentation |
| `hiui url <component>` | llms.md URL for component |
| `hiui migrate 4 5` | V4 → V5 dependency + class prefix upgrade |
| `hiui patch-for-react` | Install and inject React 19 patch |

## Related Links

- [@hi-ui/hiui-cli on npm](https://www.npmjs.com/package/@hi-ui/hiui-cli)
- [HiUI llms.txt](https://xiaomi.github.io/hiui/llms.txt)
- [Ant Design CLI skill](https://github.com/ant-design/ant-design-cli/blob/main/skills/antd/SKILL.md) (reference design)
