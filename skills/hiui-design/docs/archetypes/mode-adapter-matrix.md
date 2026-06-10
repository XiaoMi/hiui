# Mode Adapter Matrix

- `host-integration`
  mount packaged shells directly; adapter contract is optional
- `rules-only`
  translate one example into one host archetype; adapter contract is required
- `legacy-host-compatible`
  keep the host runtime intact; rebuild only through one host archetype; adapter contract is required

Strict example generation is enforced in `rules-only` and `legacy-host-compatible`.
