// 格式化value
const parseValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => {
      return typeof v === 'object' ? v.id : v
    })
  } else {
    return value === undefined ? [] : [value]
  }
}
// 整理Select数据结构 获取选中的Items id
export const resetSelectedItems = (value, dropdownItems = [], key) => {
  const values = parseValue(value)
  const selectedItems = dropdownItems.filter((item) => {
    return values.includes(item[key])
  })
  // 处理子节点
  dropdownItems.forEach((item) => {
    if (item.children) {
      item.children.forEach((childItem) => {
        values.includes(childItem[key]) && selectedItems.push(childItem)
      })
    }
  })
  return selectedItems
}

export const transKeys = (fieldNames, key) => {
  return fieldNames[key] || key
}
export const uniqBy = (array, key) => {
  const haseMap = {}
  array.forEach((item) => {
    const _key = typeof item.groupId !== 'undefined' ? item.groupId : item[key]
    haseMap[_key] = item
  })
  return Object.keys(haseMap).map((key) => {
    return haseMap[key]
  })
}
