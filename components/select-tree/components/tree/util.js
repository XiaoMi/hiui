import _ from 'lodash'
// 根据 ID 获取节点
export const getNode = (id, data) => {
  return data.find((n) => n.id === id)
}
// 根据 title 获取节点
export const getNodeByTitle = (title, data) => {
  return data.find((n) => n.title === title)
}
// 根据 id || title 获取节点
export const getNodeByIdTitle = (val, data) => {
  return data.find((n) => n.title === val || n.id === val)
}
// 获取指定节点的兄弟节点
export const getSibilingsNodes = (node, data) => {
  return data.filter((n) => n.pId === node.pId)
}

// 获取指定节点的父节点
export const getParentNode = (node, data) => {
  return data.find((n) => n.id === node.pId)
}
// 获取指定节点的直接子节点
export const getChildrenNodes = (node, data) => {
  return data.filter((n) => n.pId === node.id)
}
// 获取根节点
export const getRootNodes = (data) => {
  return data.filter((n) => !n.pId)
}
// 获取指定节点的所有后代节点
export const getDescendantNodes = (node, data, arr = []) => {
  const children = getChildrenNodes(node, data)
  if (children.length > 0) {
    children.forEach((n) => {
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
  descs.map((d) => d.id)
  data.filter((n) => descs.forEach())
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
    const chi = getChildrenNodes(ancestor, data).map((c) => c.id)
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
    const chi = getChildrenNodes(ancestor, data).map((c) => c.id)
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
export const processSelectedIds = (checkedIds, nodeEntries, type, flattenData) => {
  const keySet = new Set(checkedIds)
  if (type === 'CHILD') {
    return checkedIds.filter((id) => {
      const entity = nodeEntries[id]
      if (entity) {
        let children = []
        if (entity.children && entity.children.length > 0) {
          children = entity.children
        } else {
          // 当异步加载数据后，集合中不存在 children，根据节点取 children
          children = getChildrenNodes(entity, flattenData)
        }
        if (children.length === 0) {
          return true
        }
        if (children.every((node) => keySet.has(node.id))) {
          return false
        }
      }
      return true
    })
  }
  if (type === 'PARENT') {
    return checkedIds.filter((id) => {
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
 * 生成展开数据
 * @param {*} expandIds 受控展开节点 IDS
 * @param {*} defaultExpandIds 非受控展开节点 IDS
 * @param {*} flattenData 拉平数据
 */
export const parseExpandIds = (expandIds, defaultExpandIds, flattenData) => {
  const ids = defaultExpandIds.length > 0 ? defaultExpandIds : expandIds
  let arr = []
  ids.forEach((id) => {
    const node = getNode(id, flattenData)
    if (node) {
      arr.push(node.id)
      node.ancestors && node.ancestors.length > 0 && (arr = arr.concat(node.ancestors))
    }
  })
  return [...new Set(arr)]
}
/**
 * 将数据拉平为 pId 类数据
 * @param {*} data 原始数据
 * @param {*} defaultExpandIds 默认展开节点
 * @param {*} defaultExpandAll 是否默认展开全部节点
 * @param {*} isGenEntries 是否生成 map 集合（当多选且数据回显方式不等于 ALL 时）
 */
export const flattenNodesData = (data, isGenEntries = false) => {
  const flattenData = []
  const nodeEntries = {}
  const fun = (datas, newArr, parent = {}) => {
    datas = _.cloneDeep(datas)
    datas.forEach((node) => {
      const pId = parent.id
      node.pId = pId
      if (pId) {
        const arr = parent.ancestors ? [...parent.ancestors] : []
        arr.unshift(pId)
        node.ancestors = arr
      }
      const _children = node.children
      newArr.push(node)
      isGenEntries &&
        (nodeEntries[node.id] = {
          ...node,
          parent
        })
      if (_children && _children.length > 0) {
        fun(_children, newArr, node)
        delete node.children
      } else {
        node.isLeaf = node.hasOwnProperty('isLeaf') ? node.isLeaf : true
      }
    })
  }
  fun(data, flattenData)
  return {
    flattenData,
    nodeEntries
  }
}

export const fillNodeEntries = (parentNode, currentNodeEntries, newData) => {
  newData.forEach((nd) => {
    nd.parent = parentNode
    currentNodeEntries[nd.id] = nd
  })
  return currentNodeEntries
}
/**
 * 根据 defaultValue 解析默认选中项（自动勾选）
 * 2020.06.28 暂停「不含在数据中」的默认值，会引起诸多副作用
 * defaultValue:
 * [id, ...]  |  [title, ...] | [{id: ..}] | [{id: ..., title: ...}]
 * 匹配原则： 如果值不符合 {id, title}，会优先从现有数据中匹配 id 或 title，如匹配成功，取 node 做为已选中，如无匹配 则跳过
 * 如同时包含{id, title}，从现有数据中匹配对应数据，如有，取 node 做为已选中，如无匹配，则直接使用该值，与现有数据无关联
 */
export const parseDefaultSelectedItems = (defaultValue, flattenData) => {
  const defaultNodes = []
  if (typeof defaultValue === 'string' || typeof defaultValue === 'number') {
    const node = getNodeByIdTitle(defaultValue, flattenData)
    node && defaultNodes.push(node)
  } else if (defaultValue instanceof Array) {
    defaultValue.forEach((val) => {
      let node
      if (typeof val !== 'object') {
        // [0, 'x']
        node = getNodeByIdTitle(val, flattenData)
      } else {
        // if (val.id && val.title) {
        //   // [{id: '', title: ''}]
        //   node = getNode(val.id, flattenData) || val
        // } else {
        node = getNodeByIdTitle(val.id || val.title, flattenData)
        // }
      }
      node && defaultNodes.push(node)
    })
  }
  return defaultNodes
}

/**
 * 根据 defaultCheckedIds 解析全选/半选数据
 * @param {*} selectedItems 已选中选项
 */
export const parseCheckStatusData = (value, checkedNodes, flattenData) => {
  value = value.concat(checkedNodes.checked)
  const selectedItems = parseDefaultSelectedItems([...new Set(value)], flattenData)
  const semiCheckedIds = new Set(checkedNodes.semiChecked)
  const checkedIds = new Set(checkedNodes.checked)
  semiCheckedIds.clear()
  checkedIds.clear()
  let isUpdate = false
  selectedItems.forEach((node) => {
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
  const keys = processSelectedIds(checkedNodes.checked, nodeEntries, showCheckedMode, flattenData)
  return keys.map((id) => getNode(id, flattenData))
}

/**
 * 匹配值替换为高亮项
 * @param {*} val 搜索关键字
 * @param {*} text 节点 title
 */
export const matchFilterKey = (val, text = '') => {
  const reg = new RegExp(val, 'gi')
  const str = `<span style="color: #428ef5">${val}</span>`
  if (reg.test(text)) {
    text = text.replace(reg, str)
    return text
  }
  return null
}

/**
 * 树节点过滤（根据原始数据）
 * @param {*} data 原始数据
 * @param {*} filterVal 过滤值
 */
export const treeFilterByOriginalData = (data, filterVal) => {
  const nodes = _.cloneDeep(data)
  if (!(nodes && nodes.length)) {
    return
  }
  const newChildren = []
  for (const node of nodes) {
    const matchResult = matchFilterKey(filterVal, node.title)
    if (matchResult) {
      newChildren.push(node)
    } else {
      const subs = treeFilterByOriginalData(node.children, filterVal)
      if ((subs && subs.length) || matchResult) {
        node.children = subs
        newChildren.push(node)
      }
    }
  }
  return newChildren
}

export const clearReturnData = (arg) => {
  arg = _.cloneDeep(arg)
  if (arg instanceof Array) {
    arg = arg.map((node) => {
      delete node.ancestors
      delete node.pId
      return node
    })
  } else {
    delete arg.ancestors
    delete arg.pId
  }
  return arg
}
