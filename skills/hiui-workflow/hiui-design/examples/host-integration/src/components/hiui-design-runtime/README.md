# hiui-design managed local runtime

This directory is the managed local runtime source for generated business pages.

- Dependency contract: `docs/onboarding/managed-local-runtime-dependencies.json` is the managed dependency source of truth for this local runtime.
- Open-source skill source of truth: this runtime source tree is the primary source of truth for generated pages. Optional embedded source-package provenance may still exist in the packaged open-source skill, but it is no longer required.
- Purpose in the skill: let official templates and generated business pages import a project-local runtime instead of importing the external shell package directly.
- Purpose in target projects: these files are managed runtime assets, not free-edit business components.
- Page-owned compatibility support source now also lives under this runtime tree: `page-owned-mount-support/*` is the managed source copied into page-local support files when non-drawer full pages need shared-header suppression and mount-region fill behavior.
