---
to: <%= h.uiDir(`${name}/tsconfig.json`) %>
---
{
  "extends": "../../../tsconfig.json",
  "include": ["./src"]
}
