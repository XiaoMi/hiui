import React, { useMemo, isValidElement } from 'react'
import { toArray } from '@hi-ui/use-children'
import { CheckSelectDataItem, CheckSelectGroupDataItem, CheckSelectMergedItem } from '../types'

const NOOP_ARRAY = [] as []

export const useData = ({ data, children }: any) => {
  return useMemo(() => {
    let mergedData

    // data 优先级大于内嵌式组合
    if (Array.isArray(data)) {
      mergedData = data
    } else if (children) {
      mergedData = parseChildren(children)
    }

    return mergedData || NOOP_ARRAY
  }, [children, data])
}

export const parseChildren = (children: React.ReactNode) => {
  const data = [] as CheckSelectMergedItem[]
  const list = toArray(children)

  list.forEach((item) => {
    if (!isValidElement(item)) return
    if (!item.type) return

    const {
      type: { HiName },
    } = item as React.ReactElement & { type: { HiName?: string } }

    switch (HiName) {
      case 'CheckSelectOption':
        const option = parseOption(item)
        data.push(option)
        break
      case 'CheckSelectOptionGroup':
        const optGroup = parseOptionGroup(item)
        data.push(optGroup)
        break
    }
  })

  return data
}

const parseOption = (node: React.ReactElement) => {
  const {
    props: { value, children, disabled, groupTitle, ...rest },
  } = node

  const option = {
    id: value,
    title: children,
    disabled: disabled,
    // TODO:使用 Symbol 注入，避免 data 传入使用
    rootProps: rest,
  } as CheckSelectDataItem

  return option
}

const parseOptionGroup = (node: React.ReactElement) => {
  const {
    key,
    props: { groupId, label, children, ...rest },
  } = node

  const optGroup = {
    groupId: groupId ?? key,
    groupTitle: label,
    rootProps: rest,
    children: [],
  } as CheckSelectGroupDataItem

  if (children) {
    optGroup.children = parseChildren(children) as CheckSelectDataItem[]
  }

  return optGroup
}
