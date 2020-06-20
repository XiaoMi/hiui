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
  const fun = (datas, newArr, parent = {}) => {
    datas = _.cloneDeep(datas)
    datas.forEach(node => {
      const pId = parent.id
      node.pId = pId
      if (pId) {
        const arr = parent.ancestors ? [...parent.ancestors] : []
        arr.unshift(pId)
        node.ancestors = arr
      }
      node.isLoaded = false
      node._origin = true
      const _children = node.children
      newArr.push(node)
      nodeEntries[node.id] = {
        ...node,
        parent
      }
      if (_children) {
        if (defaultExpandAll) {
          // 默认全展开时，所有节点加入展开集合
          expandIds.add(node.id)
        }
        if (!defaultExpandAll && defaultExpandIds.includes(node.id)) {
          // 非默认全部展开时，单独处理所有祖先元素的展开状态
          tempExpands.push(node)
        }
        fun(_children, newArr, node)
        delete node.children
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

/**
 * 根据 defaultValue 解析默认选中项（自动勾选）
 * defaultValue:
 * [id, ...]  |  [title, ...] | [{id: ..}] | [{id: ..., title: ...}]
 * 匹配原则： 如果值不符合 {id, title}，会优先从现有数据中匹配 id 或 title，如匹配成功，取 node 做为已选中，如无匹配 则跳过
 * 如同时包含{id, title}，从现有数据中匹配对应数据，如有，取 node 做为已选中，如无匹配，则直接使用该值，与现有数据无关联
 */
export const parseDefaultSelectedItems = (defaultValue, flattenData) => {
  const defaultNodes = []
  if (typeof defaultValue === 'string') {
    const node = getNodeByIdTitle(defaultValue, flattenData)
    node && defaultNodes.push(node)
  } else if (defaultValue instanceof Array) {
    defaultValue.forEach(val => {
      let node
      if (typeof val !== 'object') {
        // [0, 'x']
        node = getNodeByIdTitle(val, flattenData)
      } else {
        if (val.id && val.title) {
          // [{id: '', title: ''}]
          node = getNode(val.id, flattenData) || val
        } else {
          node = getNodeByIdTitle(val.id || val.title, flattenData)
        }
      }
      if (node) {
        defaultNodes.push(node)
      }
    })
  }
  return defaultNodes
}

/**
 * 根据 defaultCheckedIds 解析全选/半选数据
 * @param {*} selectedItems 已选中选项
 */
export const parseCheckStatusData = (selectedItems, checkedNodes, flattenData) => {
  let semiCheckedIds = new Set(checkedNodes.semiChecked)
  const checkedIds = new Set(checkedNodes.checked)
  semiCheckedIds.clear()
  checkedIds.clear()
  let isUpdate = false
  selectedItems.forEach(node => {
    isUpdate = true
    updateCheckData(node, flattenData, checkedIds, semiCheckedIds)
  })
  if (isUpdate) {
    return {
      checked: [...checkedIds],
      semiChecked: [...semiCheckedIds]
    }
  }
  return null
}

/**
 * 根据数据回显方式设定显示的数据
 * @param {*} checkIds 当前选中的节点 ID 集合
 */
export const parseSelectedItems = (checkedNodes, nodeEntries, showCheckedMode, flattenData) => {
  const keys = processSelectedIds(checkedNodes.checked, nodeEntries, showCheckedMode)
  return keys.map(id => getNode(id, flattenData))
}

export const arrayTreeFilter = (data, predicate) => {
  const nodes = _.cloneDeep(data)
  // 如果已经没有节点了，结束递归
  if (!(nodes && nodes.length)) {
    return
  }
  const newChildren = []
  for (const node of nodes) {
    if (predicate(node)) {
      // 如果自己（节点）符合条件，直接加入到新的节点集
      newChildren.push(node)
      // 并接着处理其 children,（因为父节点符合，子节点一定要在，所以这一步就不递归了）
      // node.children = arrayTreeFilter(node.children, predicate);
    } else {
      // 如果自己不符合条件，需要根据子集来判断它是否将其加入新节点集
      // 根据递归调用 arrayTreeFilter() 的返回值来判断
      const subs = arrayTreeFilter(node.children, predicate)
      // const subs = arrayTreeFilter(getChildrenNodes(node, data2), predicate);
      // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
      // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
      // 2. 自己本身符合条件
      if ((subs && subs.length) || predicate(node)) {
        node.children = subs
        newChildren.push(node)
      }
    }
  }
  return newChildren
}
