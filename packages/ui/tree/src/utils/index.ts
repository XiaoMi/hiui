import cloneDeep from 'lodash.clonedeep'

// 寻找某一节点的父节点
export const getParentId = (id, data) => {
  let parentId
  data.forEach((item) => {
    if (item.children) {
      if (item.children.some((item) => item.id === id)) {
        parentId = item.id
      } else if (getParentId(id, item.children)) {
        parentId = getParentId(id, item.children)
      }
    }
  })
  return parentId
}

export const getParent = (id, data) => {
  let parent
  data.forEach((item) => {
    if (item.children) {
      if (item.children.some((item) => item.id === id)) {
        parent = item
      } else if (getParent(id, item.children)) {
        parent = getParent(id, item.children)
      }
    }
  })
  return parent
}

// 寻找某一节点的所有祖先节点
export const getAncestorIds = (id, data, arr = []) => {
  if (getParentId(id, data)) {
    arr.push(getParentId(id, data))
    getAncestorIds(getParentId(id, data), data, arr)
  }
  return arr
}

export const getAncestors = (id, data, arr = []) => {
  if (getParent(id, data)) {
    arr.push(getParent(id, data))
    getAncestors(getParent(id, data).id, data, arr)
  }
  return arr
}

// 寻找某一节点的所有子节点
export const getChildrenIds = (node, arr = []) => {
  if (node.children) {
    arr.splice(0, 0, ...node.children.map((i) => i.id))
    node.children.forEach((c) => getChildrenIds(c, arr))
  }

  return arr
}

// 给定一个结合，根据 id 寻找节点
export const findNode = (itemId, data) => {
  let node
  data.forEach((d, index) => {
    if (d.id === itemId) {
      node = d
    } else {
      if (d.children && findNode(itemId, d.children)) {
        node = findNode(itemId, d.children)
      }
    }
  })
  return node
}

export const getSemiChecked = (checkedIds, data, allData, semiChecked = []) => {
  data.forEach((node) => {
    const ancestorIds = getAncestorIds(node.id, allData)
    if (checkedIds.includes(node.id)) {
      ancestorIds.forEach((ancestorId) => {
        if (!checkedIds.includes(ancestorId) && !semiChecked.includes(ancestorId)) {
          semiChecked.push(ancestorId)
        }
      })
    }
    if (node.children) {
      getSemiChecked(checkedIds, node.children, allData, semiChecked)
    }
  })
  return semiChecked
}

export const flattenTreeData = (data) => {
  const treeData = cloneDeep(data)

  // 动态数组
  for (let i = 0; i < treeData.length; ++i) {
    const parent = treeData[i]
    const { depth = 0, children, id } = parent

    if (!depth) {
      parent.depth = 0
    }

    if (children) {
      const _children = children.map((child) => {
        // 层级
        child.depth = depth + 1
        child.parentId = id
        // siblings
        child.sibling = children
        child.parent = parent
        // 组件节点
        child.ancestors = getAncestors(child.id, treeData)
        return child
      })
      // 优化递归
      treeData.splice(i + 1, 0, ..._children)
    }
  }
  return treeData
}
