---
to: <%= h.hooksDir(`${name}/tsconfig.json`) %>
---
{
  "extends": "../../../tsconfig.json",
  "include": ["./src"]
}
