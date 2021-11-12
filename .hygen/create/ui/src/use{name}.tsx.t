---
to: <%= h.uiDir(`${name}/src/use-${name}.ts`) %>
---

import { useCallback } from 'react'
import { <%= h.camelCase(name) %>DataItem } from './types'

const NOOP_ARRAY = [] as []

export const  use<%= h.camelCase(name) %> = ({
data: dataProp = NOOP_ARRAY,
  ...rest
}: Use<%= h.camelCase(name) %>Props) => {
  const getRootProps = useCallback(() => {
    return rest
  }, [rest])

  return { getRootProps }
}

export interface Use<%= h.camelCase(name) %>Props {
  data: <%= h.camelCase(name) %>DataItem[]
}

export type Use<%= h.camelCase(name) %>Return = ReturnType<typeof use<%= h.camelCase(name) %>>
