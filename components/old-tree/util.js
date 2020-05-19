export function deepMap (data, parent) {
  let arr = []
  for (let key in data) {
    let item = { ...data[key] }
    if (parent) {
      item.parent = parent
    } else {
      item.parent = []
    }
    if (item.children && item.children.length > 0) {
      let childParent = [...item.parent]
      childParent.unshift(item.id)
      arr = arr.concat(deepMap(item.children, childParent))
      delete item.children
    } else {
      // item.parent = parent
    }
    arr.push(item)
  }
  return arr
}

export function getChild (data, id) {
  let arr = []
  data.forEach((item) => {
    if (!item.parent.includes(id)) {
      return
    }
    if (arr.includes(id)) {
      return
    }
    arr.push(item.id)
  })
  return arr
}

export function getAll (data, checkedKeys) {
  let all = deepMap(data)
  all = all.map((item) => {
    item.child = getChild(all, item.id)
    item.family = item.parent.concat(item.child)
    item.semi = false
    let num = 0
    checkedKeys.forEach((c) => {
      if (item.child.includes(c)) {
        num = num + 1
      }
    })
    item.num = num
    item.semi = num !== 0 && num !== item.child.length
    return item
  })
  return all
}

export const dealData = (data, tempData = {}, parent = null) => {
  if (data.length === 0) {
    return data
  }
  data.map((item) => {
    tempData[item.id] = { ...item }
    if (parent) {
      tempData[item.id].parent = parent
    }
    if (item.children && item.children.length > 0) {
      const tempArr = []
      item.children.map((i) => {
        tempArr.push(i.id)
      })
      tempData[item.id].children = tempArr
      dealData(item.children, tempData, item.id)
    }
  })
}

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

// 寻找某一节点的所有子节点
export const getChildrenIds = (node, arr = []) => {
  if (node.children) {
    arr = node.children.map((i) => i.id).concat(arr)
    node.children.forEach((c) => getChildrenIds(c, arr))
  }

  return arr
}
// 寻找某一节点的所有祖先节点
export const getAncestorIds = (id, data, arr = []) => {
  if (getParentId(id, data)) {
    arr.push(getParentId(id, data))
    getAncestorIds(getParentId(id, data), data, arr)
  }
  return arr
}

// 收集所有需要展开的节点 id
export const collectExpandId = (
  data,
  searchValue,
  collection = [],
  allData
) => {
  data.forEach((item) => {
    if (searchValue && item.title.includes(searchValue)) {
      const parentIds = getAncestorIds(item.id, allData, [])
      collection.splice(collection.length - 1, 0, ...parentIds)
    }
    if (item.children) {
      collectExpandId(item.children, searchValue, collection, allData)
    }
  })
  return collection
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
