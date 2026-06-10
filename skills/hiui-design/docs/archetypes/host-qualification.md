# Host Qualification

Before generating business pages in `rules-only` or `legacy-host-compatible`, confirm the target host can provide:

- a header slot or a stable page header container
- a single white-body owner
- a single main scroll owner
- the page-type-specific regions required by the archetype

If these capabilities do not exist, scaffold an adapter first. Do not generate the business page from primitives.

For `rules-only` and `legacy-host-compatible`, qualification is not complete until you can name:

- one host archetype path
- one host adapter family from `archetypes/registry/common.adapter-capabilities.json`

Both must be written back into the generated page's source contract markers, together with the exact example path. If the page cannot declare that copy chain, it is not a qualified example-based page yet.
