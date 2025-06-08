import React from 'react'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { TabPaneProps } from '../TabPane'

export const getNextTabId = (data: TabPaneProps[], tabId: React.ReactText) => {
  if (isArrayNonEmpty(data)) {
    const itemIndex = data.findIndex((item) => item.tabId === tabId)
    if (itemIndex !== -1) {
      if (data[itemIndex + 1]) {
        return data[itemIndex + 1].tabId
      }
      if (data[itemIndex - 1]) {
        return data[itemIndex - 1].tabId
      }
    }
  }
  return null
}
