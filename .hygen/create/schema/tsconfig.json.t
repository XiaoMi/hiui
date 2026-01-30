---
to: <%= h.schemaDir(`${name}/tsconfig.json`) %>
---
{
  "extends": "../../../tsconfig.json",
  "include": ["./src"]
}
