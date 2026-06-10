# Security

Run `node scripts/sync-open-source-package.mjs --target <public-repo>` from the private source and review the generated diff before publishing.

The sync performs a basic private-marker scan, but it is not a substitute for repository-wide secret scanning before public release.
