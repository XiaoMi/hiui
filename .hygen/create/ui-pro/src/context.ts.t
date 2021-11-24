---
to: <%= h.uiDir(`${name}/src/context.ts`) %>
---

import { createContext, useContext } from 'react'

import { Use<%= h.camelCase(name) %>Return } from './use-<%= name %>'

const <%= h.camelCase(name) %>Context = createContext<Omit<Use<%= h.camelCase(name) %>Return, 'rootProps'> | null>(null)

export const <%= h.camelCase(name) %>Provider = <%= h.camelCase(name) %>Context.Provider

export const use<%= h.camelCase(name) %>Context = () => {
  const context = useContext(<%= h.camelCase(name) %>Context)

  if (!context) {
    throw new Error('The <%= h.camelCase(name) %>Context context should using in <%= h.camelCase(name) %>.')
  }

  return context
}
