# Archetype Core Model

Every archetype must define:

- `pageTypeId`
- `examplePath`
- `shell`
- `requiredRegions`
- `requiredOwnershipRoles`
- `requiredCapabilities`
- `allowedOverrides`
- `forbiddenEscapes`
- `modeAdapters`

The generation rule is strict:

1. lock one example page
2. lock one host archetype
3. emit one adapter contract
4. allow only slot-level business overrides

If a page cannot name these inputs, it is not ready for generation.
