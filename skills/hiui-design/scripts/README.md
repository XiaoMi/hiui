# HiUI Design Scripts

This public package keeps only the reusable page-generation and validation scripts that can be shipped to downstream projects. It keeps the vendored typical-page runtime tgz so downstream users can clone or download the repository and use it directly, while private publishing, internal telemetry, Feishu sync, and global-sync automation stay excluded.

## Machine Public CLI

The stable machine-readable contract surface is listed in `scripts/public-cli-contracts.json` under the `machine-public` tier.

- Planning and delivery loop: `plan-page-task.mjs`, `typical-page-start-page.mjs`, `typical-page-preflight.mjs`, `typical-page-runtime-smoke.mjs`, `typical-page-preview-ready.mjs`, `render-final-report.mjs`
- Asset facts and previews: `typical-page-capabilities.mjs`, `typical-page-list-assets.mjs`, `typical-page-inspect-asset.mjs`, `typical-page-add-asset.mjs`, `typical-page-diff-asset.mjs`, `typical-page-update-asset.mjs`
- Public runtime release gates: `check-public-runtime-publish-readiness.mjs`, `verify-public-runtime-release.mjs`
  These are optional gates for publishing `packages/typical-page-shells` to public npm. The vendored tgz checked into this repository remains the default runtime delivery contract for direct-use installs.

## Project Setup and Host Integration

- Entry points: `setup-for-designers.mjs`, `apply-in-current-project.mjs`, `bootstrap-target-project.mjs`
- Host / archetype helpers: `select-archetype.mjs`, `sync-host-integration.mjs`, `setup-isolated-standard-shell.mjs`, `detect-legacy-host-family.mjs`
- Local asset/bootstrap helpers: `init-archetypes.mjs`, `init-i18n.mjs`, `init-project-images.mjs`, `validate-pre-plan-facts.mjs`

## Validation and Governance

- Doctor / contract helpers: `typical-page-doctor.mjs`, `write-rules-only-page-contract.mjs`, `finalize-rules-only-page.mjs`, `generate-translation-map.mjs`
- Gate chain: `typical-page-candidate-gate.mjs`, `typical-page-slot-gate.mjs`, `typical-page-contract-gate.mjs`, `typical-page-archetype-gate.mjs`, `typical-page-source-gate.mjs`, `typical-page-doctor-gate.mjs`, `typical-page-ci-gate.mjs`
- Regression checks: `verify-typical-page-doctor-rules-only-regressions.mjs`, `verify-managed-page-source-guard-regressions.mjs`, `verify-managed-chart-flow-regressions.mjs`, `verify-non-typical-overlay-regressions.mjs`

## Knowledge and Distribution Maintenance

- HiUI v5 knowledge sync: `sync-hiui-v5-manifest.mjs`, `sync-hiui-v5-quick-reference.mjs`, `sync-hiui-v5-component-map.mjs`, `validate-hiui-v5-knowledge.mjs`
- Distribution validation: `check-distribution-boundary.mjs`, `validate-distribution-manifest.mjs`, `build-runtime-mirror.mjs`
- Template boundary guard: `check-i18n-template-boundary.mjs`

## Human Entry Points

- Start with `SKILL.md` for task routing and guardrails.
- Use root `README.md` for package scope and sync context.
- Use `PRIVACY.md` for usage-data behavior in this public package.
