---
to: <%= h.uiDir(`${name}/src/index.ts`) %>
---
import './style/index.scss'

export * from './<%= h.camelCase(name) %>'
export { <%= h.camelCase(name) %> as default } from './<%= h.camelCase(name) %>'
