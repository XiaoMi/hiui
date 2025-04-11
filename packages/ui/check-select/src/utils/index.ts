import React from 'react'

/**
 * 判断选项是否进行可选操作
 */
export const isCheckableOption = (item: any) => {
  if ('groupTitle' in item) return false
  if (item.disabled) return false
  return true
}

/**
 * 判断选项为
 */
export const isOption = (item: any) => {
  if ('groupTitle' in item) return false
  return true
}

export const getAllCheckedStatus = (
  dropdownItems: any[],
  values: React.ReactText[],
  filterFunc: (item: any) => boolean
) => {
  if (!Array.isArray(values)) {
    return [false, false]
  }

  const dropdownIds = dropdownItems.filter(filterFunc).map(({ id }: any) => id)
  const dropdownIdsSet = new Set(dropdownIds)

  let hasValue = false

  values.forEach((id) => {
    if (dropdownIdsSet.has(id)) {
      hasValue = true
      dropdownIdsSet.delete(id)
    }
  })

  return [hasValue && dropdownIdsSet.size === 0, hasValue && dropdownIdsSet.size > 0]
}
