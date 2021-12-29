// 寻找某一节点的父节点
export const getParentId = (id: string | number, data: Record<string, any>[]): string | number => {
  let parentId = '' as string | number
  data.forEach((item) => {
    if (item.children) {
      if (item.children.some((item: Record<string, any>) => item.id === id)) {
        parentId = item.id
      } else if (getParentId(id, item.children)) {
        parentId = getParentId(id, item.children)
      }
    }
  })
  return parentId
}

// 寻找某一节点的所有祖先节点
export const getAncestorIds = (
  id: string | number,
  data: Record<string, any>[],
  arr: (string | number)[] = []
) => {
  if (getParentId(id, data)) {
    arr.push(getParentId(id, data))
    getAncestorIds(getParentId(id, data), data, arr)
  }
  return arr
}
