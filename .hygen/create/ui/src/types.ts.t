---
to: <%= h.uiDir(`${name}/src/types.ts`) %>
---

import React from 'react'

export interface <%= h.camelCase(name) %>DataItem {
  /**
   * 节点唯一 id
   */
  id: React.ReactText
  /**
   * 节点标题
   */
  title: React.ReactNode
}
