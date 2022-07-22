---
to: <%= h.hooksDir(`${name}/src/index.ts`) %>
---
import { } from 'react'

/**
 * TODO: What is <%= h.hump(name) %>
 */
export const <%= h.hump(name) %> = ({}: <%= h.camelCase(name) %>Props) => {

}

export interface <%= h.camelCase(name) %>Props {
}

export type <%= h.camelCase(name) %>Return = ReturnType<typeof <%= h.hump(name) %>>
