import _ from 'lodash'
// 根据 ID 获取节点
export const getNode = (id, data) => {
  return data.find(n => n.id === id)
}
// 根据 title 获取节点
export const getNodeByTitle = (title, data) => {
  return data.find(n => n.title === title)
}
// 根据 id || title 获取节点
export const getNodeByIdTitle = (val, data) => {
  return data.find(n => n.title === val || n.id === val)
}
// 获取指定节点的兄弟节点
export const getSibilingsNodes = (node, data) => {
  return data.filter(n => n.pId === node.pId)
}

// 获取指定节点的父节点
export const getParentNode = (node, data) => {
  return data.find(n => n.id === node.pId)
}
// 获取指定节点的直接子节点
export const getChildrenNodes = (node, data) => {
  return data.filter(n => n.pId === node.id)
}
// 获取根节点
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

export const hasChildren = (node, data) => {
  let bol = false
  for (let i = 0; i < data.length; i++) {
    if (data[i].pId === node.id) {
      bol = true
      break
    }
  }
  return bol
}
// 移除指定节点的所有后代节点
export const removeDescendantNodes = (node, data) => {
  const descs = getDescendantNodes(node, data)
  descs.map(d => d.id)
  data.filter(n => descs.forEach())
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

/**
 * 处理选中数据
 * @param {*} node 当前节点
 * @param {*} data 拉平数据
 * @param {*} checkedIds 选中 IDS
 * @param {*} semiCheckedIds 半选 IDS
 */
export const updateCheckData = (node, data, checkedIds, semiCheckedIds) => {
  const children = getDescendantNodes(node, data)
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

/**
 * 处理取消选中数据
 * @param {*} node 当前节点
 * @param {*} data 拉平数据
 * @param {*} checkedIds 选中 IDS
 * @param {*} semiCheckedIds 半选 IDS
 */
export const updateUnCheckData = (node, data, checkedIds, semiCheckedIds) => {
  const children = getDescendantNodes(node, data)
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

/**
 * 处理选中的回显数据
 * @param {*} checkedIds 当前所有被选中的节点 ID 集合
 * @param {*} nodeEntries 所有数据的Map 集合
 * @param {*} type 数据回显方式
 */
export const processSelectedIds = (checkedIds, nodeEntries, type) => {
  const keySet = new Set(checkedIds)
  if (type === 'CHILD') {
    return checkedIds.filter(id => {
      const entity = nodeEntries[id]
      if (entity && entity.children && entity.children.every(node => keySet.has(node.id))) {
        return false
      }
      return true
    })
  }
  if (type === 'PARENT') {
    return checkedIds.filter(id => {
      const entity = nodeEntries[id]
      const parent = entity ? entity.parent : null
      if (parent && keySet.has(parent.id)) {
        return false
      }
      return true
    })
  }
  return checkedIds
}

/**
 * 将数据拉平为 pId 类数据
 * @param {*} data 原始数据
 * @param {*} defaultExpandIds 默认展开节点
 * @param {*} defaultExpandAll 是否默认展开全部节点
 * @param {*} isGenEntries 是否生成 map 集合（当多选且数据回显方式不等于 ALL 时）
 */
export const flattenNodesData = (data, defaultExpandIds = [], defaultExpandAll = false, isGenEntries = false) => {
  let flattenData = []
  const expandIds = new Set([])
  const nodeEntries = {}
  let tempExpands = []
  const addExpandIds = (node) => {
    const ancestorsNodes = getAncestorsNodes(node, flattenData)
    ancestorsNodes.forEach(n => expandIds.add(n.id))
    expandIds.add(node.id)
  }
  const fun = (datas, nArr, parent) => {
    datas.forEach(node => {
      node.pId = parent ? parent.id : null
      node.isLoaded = false
      node._origin = true
      nArr.push(node)
      nodeEntries[node.id] = {
        ...node,
        parent
      }
      if (node.children) {
        if (defaultExpandAll) {
          // 默认全展开时，所有节点加入展开集合
          expandIds.add(node.id)
        }
        if (!defaultExpandAll && defaultExpandIds.includes(node.id)) {
          // 非默认全部展开时，单独处理所有祖先元素的展开状态
          tempExpands.push(node)
        }
        fun(node.children, nArr, node)
      } else {
        node.isLeaf = true
      }
    })
  }
  fun(data, flattenData)
  if (tempExpands.length > 0) {
    tempExpands.forEach(te => addExpandIds(te))
  }
  return {
    flattenData,
    expandIds: [...expandIds],
    nodeEntries
  }
}
