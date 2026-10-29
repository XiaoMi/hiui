# HiUI5 Dependency Isolation Check

- scope: project-level runtime dependency isolation check
- report intent: Validate that hiui-design runtime dependencies remain isolated, pinned, and compatible before page generation.
- status: pass
- sourcePackage: @example/runtime-source-package
- sourcePackageVersion: 0.1.1
- expectedSourcePackageSpec: file:.local-context/hiui-design/vendor/runtime-source-package-0.1.1.tgz

## Summary

- totalChecks: 9
- passedChecks: 9
- failedChecks: 0
- failedCheckIds: —

## Checks

- managed-local-runtime-dependency-contract: pass — ../../work/git/hiui/skills/hiui-workflow/hiui-design/docs/onboarding/managed-local-runtime-dependencies.json declares 18 managed runtime dependencies
- managed-local-runtime-source-package-snapshot: pass — @example/runtime-source-package@0.1.1 (../../work/git/hiui/skills/hiui-workflow/hiui-design/vendor/runtime-source-package.package.json, ../../work/git/hiui/skills/hiui-workflow/hiui-design/vendor/runtime-source-package-0.1.1.tgz)
- shared-runtime-direct-dependencies: pass — App entry imports shared runtime direct dependencies, and package.json plus installed modules satisfy the contract: @hi-ui/patch-for-react.
- managed-local-runtime-materialized: pass — src/components/hiui-design-runtime/index.js
- lockfile-present: pass — package-lock.json
- peer-dependencies-compatible-with-managed-runtime-contract: pass — direct=18, isolated=23
- hiui-runtime-graph-uses-hiui5-only: pass — 59 reachable @hi-ui package(s) satisfy the HiUI runtime major rule
- schema-peer-isolation-alias: pass — no legacy rspack/webpack build config detected; Vite projects rely on package isolation and schema-types aliasing instead
- no-private-source-package-import-paths: pass — no private source-package import paths found

## Decision

- canContinue: true
- nextAction: Dependency isolation is healthy. You can continue with hiui-design page generation and runtime verification.

