---
to: <%= h.uiDir(`${name}/src/index.ts`) %>
---
import './style/index.scss'

export * from './<%= name %>'
export { default } from './<%= name %>'
