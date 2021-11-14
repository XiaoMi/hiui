---
to: <%= h.uiDir(`${name}/src/use-${name}.ts`) %>
---

import { <%= h.camelCase(name) %>DataItem } from './types'

const NOOP_ARRAY = [] as []

export const  use<%= h.camelCase(name) %> = ({
data: dataProp = NOOP_ARRAY,
  ...rest
}: Use<%= h.camelCase(name) %>Props) => {

  return { rootProps: rest }
}

export interface Use<%= h.camelCase(name) %>Props {
  data: <%= h.camelCase(name) %>DataItem[]
}

export type Use<%= h.camelCase(name) %>Return = ReturnType<typeof use<%= h.camelCase(name) %>>
