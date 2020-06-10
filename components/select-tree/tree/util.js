import _ from 'lodash'
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

// 寻找某一节点的所有祖先节点
export const getAncestorIds = (id, data, arr = []) => {
  if (getParentId(id, data)) {
    arr.push(getParentId(id, data))
    getAncestorIds(getParentId(id, data), data, arr)
  }
  return arr
}

// 寻找某一节点的所有后代节点
export const getChildrenIds = (node, arr = []) => {
  if (node.children) {
    node.children.forEach((_n) => {
      arr.push(_n.id)
      if (_n.children) {
        getChildrenIds(_n, arr)
      }
    })
    // arr = node.children.map((i) => i.id).concat(arr)
    // console.log(node, arr)
    // node.children.forEach((c) => getChildrenIds(c, arr))
  }
  console.log('arr', JSON.stringify(arr))
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
        if (
          !checkedIds.includes(ancestorId) &&
          !semiChecked.includes(ancestorId)
        ) {
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

export const getNode = (id, data) => {
  return data.find(n => n.id === id)
}
// 获取指定节点的兄弟节点
export const getSibilingsNodes = (node, data) => {
  return data.filter(n => n.pId === node.pId)
}

// 获取指定节点的父节点
export const getParentNode = (node, data) => {
  return data.filter(n => n.id === node.pId)[0]
}

// 获取指定节点的直接子节点
export const getChildrenNodes = (node, data) => {
  return data.filter(n => n.pId === node.id)
}
export const getRootNodes = (data) => {
  return data.filter(n => !n.pId)
}

// 获取指定节点的所有后代节点
export const getDescendantNodes = (node, data, arr = []) => {
  const children = getChildrenNodes(node, data)
  if (children.length > 0) {
    children.forEach(n => {
      arr.push(n)
      if (!n.isLeaf) {
        getDescendantNodes(n, data, arr)
      }
    })
  }
  return arr
}

// 获取指定节点的所有祖先节点
export const getAncestorsNodes = (node, data, arr = []) => {
  const firstParentNode = getParentNode(node, data)
  if (firstParentNode) {
    arr.push(firstParentNode)
    getAncestorsNodes(firstParentNode, data, arr)
  }
  return arr
}

export const updateCheckData = (node, data, checkedIds, semiCheckedIds) => {
  const children = node.isLeaf ? [] : getDescendantNodes(node, data)
  const ancestors = node.pId ? getAncestorsNodes(node, data) : []
  children.forEach((child) => {
    checkedIds.add(child.id)
    semiCheckedIds.delete(child.id)
  })
  semiCheckedIds.delete(node.id)
  checkedIds.add(node.id)
  ancestors.forEach((ancestor) => {
    const chi = getChildrenNodes(ancestor, data).map(c => c.id)
    const ins = _.intersection(chi, [...checkedIds])
    if (ins.length === chi.length) {
      checkedIds.add(ancestor.id)
      semiCheckedIds.delete(ancestor.id)
    } else {
      semiCheckedIds.add(ancestor.id)
    }
  })
  return {
    checked: [...checkedIds],
    semiChecked: [...semiCheckedIds]
  }
}

export const updateUnCheckData = (node, data, checkedIds, semiCheckedIds) => {
  const children = node.isLeaf ? [] : getDescendantNodes(node, data)
  const ancestors = node.pId ? getAncestorsNodes(node, data) : []
  checkedIds.delete(node.id)
  ancestors.forEach((ancestor) => {
    checkedIds.delete(ancestor.id)
    semiCheckedIds.add(ancestor.id)
    const chi = getChildrenNodes(ancestor, data).map(c => c.id)
    const ins = _.intersection(chi, [...checkedIds, ...semiCheckedIds])
    if (ins.length === 0) {
      checkedIds.delete(ancestor.id)
      semiCheckedIds.delete(ancestor.id)
    }
  })

  children.forEach((child) => {
    checkedIds.delete(child.id)
  })
  return {
    checked: [...checkedIds],
    semiChecked: [...semiCheckedIds]
  }
}
