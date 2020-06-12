/**
 * @Author lishuaishuai <lishuaishuai@xiaomi.com>
 * @Date 2018-03-22 11:14:48
 * @Description tree相关工具封装
 */

/**
 * toggleSlide动画
 * @param {element} el 目标节点
 * @param {boolen} isClose 当前状态是否为关闭
 * @param {function} func 动画结束后的回调行数
 */
export function toggleSlide (el, isClose, func) {
  if (!isClose) {
    el.style.display = 'block'
    el.style.height = 0
  }
  const maxDelay = 300
  const height = el.scrollHeight
  const speed = Math.max(height / maxDelay, 0.5)
  let sum = 0

  let start = null
  const animate = timestamp => {
    if (!start) start = timestamp
    const progress = timestamp - start
    sum = progress * speed
    el.style.height = `${isClose ? height - sum : sum}px`
    if (height < sum) {
      if (isClose) {
        el.style.display = 'none'
      }
      el.style.height = ''
      func()
    } else {
      window.requestAnimationFrame(animate)
    }
  }
  window.requestAnimationFrame(animate)
}
/**
 * 计算鼠标在当前节点的位置
 * @param {*} event
 * @param {*} treeNode 拖拽进入的当前节点
 */
export function calcDropPosition (event, treeNode) {
  const offsetTop = getOffset(treeNode).top
  const offsetHeight = treeNode.offsetHeight
  const pageY = event.pageY
  const gapHeight = 2
  if (pageY > offsetTop + offsetHeight - gapHeight) {
    return 1
  }
  if (pageY < offsetTop + gapHeight) {
    return -1
  }
  return 0
}
/**
 * 计算offset
 * @param {*} ele
 */
export function getOffset (ele) {
  if (!ele.getClientRects().length) {
    return { top: 0, left: 0 }
  }

  const rect = ele.getBoundingClientRect()
  if (rect.width || rect.height) {
    const doc = ele.ownerDocument
    const win = doc.defaultView
    const docElem = doc.documentElement

    return {
      top: rect.top + win.pageYOffset - docElem.clientTop,
      left: rect.left + win.pageXOffset - docElem.clientLeft
    }
  }

  return rect
}
/**
 * 将当前节点移动到目标节点之前
 * @param {ele} cur 当前节点
 * @param {ele} tar 目标节点
 */
export function insBefore (cur, tar) {
  const current = cur.parentNode.parentNode // li
  const target = tar.parentNode // li
  target.parentNode.insertBefore(current, target)
}
/**
 * 将当前节点移动到目标节点之后
 * @param {ele} cur 当前节点
 * @param {ele} tar 目标节点
 */
export function insAfter (cur, tar) {
  const current = cur.parentNode.parentNode // li
  const target = tar.parentNode // li
  if (target.parentNode.lastChild === target) {
    target.parentNode.appendChild(current)
  } else {
    target.parentNode.insertBefore(current, target.nextSibling)
  }
}
/**
 * 将当前节点移动为目标节点子节点
 * @param {ele} cur 当前节点
 * @param {ele} tar 目标节点
 */
export function insChild (cur, tar) {
  const current = cur.parentNode.parentNode // li
  const target = tar.parentNode.parentNode // li
  if (current === target) return
  if (target.childNodes.length > 1) {
    tar.parentNode.nextSibling.appendChild(current)
  } else {
    let ul = document.createElement('ul')
    ul.setAttribute('class', 'hi-tree-child')
    ul.appendChild(current)
    target.appendChild(ul)
  }
  target.classList.remove('switcher-none')
}

/**
 * 深拷贝
 * @param {*} arr
 */
export function deepClone (arr) {
  let i
  let copy

  if (Array.isArray(arr)) {
    copy = arr.slice(0)
    for (i = 0; i < copy.length; i += 1) {
      copy[i] = deepClone(copy[i])
    }
    return copy
  } else if (typeof arr === 'object') {
    return Object.assign({}, arr)
  }
  return arr
}

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
  data.forEach(item => {
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

export function getSemi (data, checks) {
  let all = deepMap(data)
  let arr = all
    .map(item => {
      item.child = getChild(all, item.id)
      item.family = item.parent.concat(item.child)
      item.semi = false
      let num = 0
      checks.forEach(c => {
        if (item.child.includes(c)) {
          num = num + 1
        }
      })
      item.num = num
      item.semi = num !== 0 && num !== item.child.length
      return item
    })
    .filter(item => item.semi)
    .map(item => item.id)
  return arr
}

export function getChildren (data, id) {
  let all = deepMap(data)
  return all
    .map(item => {
      item.child = getChild(all, item.id)
      return item
    })
    .find(item => item.id === id).child
}

export function getDisabled (data) {
  let all = deepMap(data)
  return all.filter(item => item.disabled).map(item => item.id)
}

export function getItem (data, id) {
  let all = deepMap(data)
  return all.find(item => item.id === id)
}
export function getAll (data, checkedKeys) {
  let all = deepMap(data)
  all = all.map(item => {
    item.child = getChild(all, item.id)
    item.family = item.parent.concat(item.child)
    item.semi = false
    let num = 0
    checkedKeys.forEach(c => {
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
  data.map(item => {
    tempData[item.id] = { ...item }
    if (parent) {
      tempData[item.id].parent = parent
    }
    if (item.children && item.children.length > 0) {
      const tempArr = []
      item.children.map(i => {
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
  data.forEach(item => {
    if (item.children) {
      if (item.children.some(item => item.id === id)) {
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
    arr = node.children.map(i => i.id).concat(arr)
  }
  node.children.forEach(c => getChildrenIds(c, arr))
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
export const collectExpandId = (data, searchValue, collection = [], allData) => {
  data.forEach(item => {
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
