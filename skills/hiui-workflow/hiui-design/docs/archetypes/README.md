# Archetypes

`hiui-design` now treats archetypes as a first-class generation asset.

Roles:

- example pages define the canonical structure
- page-type rules define when to use that structure
- archetypes define how the structure may be translated into a target host
- adapter contracts record how one project binds a canonical example to one host archetype
- source contracts anchor that binding back into JSX via `hiui-design example alignment` comments and `data-hiui5-*` region / ownership markers

This directory is explanatory only. Machine-readable archetype facts live under `archetypes/`.
