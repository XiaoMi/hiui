---
to: <%= h.uiDir(`${name}/src/index.ts`) %>
---
import './style/index.scss'

export * from './<%= name %>'
export { <%= h.camelCase(name) %> as default } from './<%= name %>'
