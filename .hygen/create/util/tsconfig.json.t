---
to: <%= h.utilsDir(`${name}/tsconfig.json`) %>
---
{
  "extends": "../../../tsconfig.json",
  "include": ["./src"]
}
