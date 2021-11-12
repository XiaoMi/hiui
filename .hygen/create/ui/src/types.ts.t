---
to: <%= h.uiDir(`${name}/src/types.ts`) %>
---

import React from 'react'

export interface <%= h.camelCase(name) %>DataItem {
  /**
   * 树节点唯一 id
   */
  id: React.ReactText
  /**
   * 树节点标题
   */
  title: React.ReactNode
}
