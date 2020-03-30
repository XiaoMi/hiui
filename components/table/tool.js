export function insertAfter (newElement, targetElement) {
  let parent = targetElement.parentNode
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling)
  }
}
export function setKey (data, name) {
  name = name || 'id'
  return data.map(item => {
    item.key = item.key || item[name]
    return item
  })
}

export function getStyle (obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr]
  } else {
    return window.getComputedStyle(obj, null)[attr]
  }
}

export function position (obj) {
  let pos = {left: 0, top: 0}

  while (obj.parentNode) {
    pos.left += obj.clientLeft
    pos.top += obj.clientTop
    obj = obj.parentNode
  }
  return pos
}

export function offset (element) {
  let offest = {
    top: 0,
    left: 0
  }

  let _position

  getOffset(element, true)

  return offest

  // 递归获取 offset, 可以考虑使用 getBoundingClientRect
  function getOffset (node, init) {
    // 非Element 终止递归
    if (!node) {
      return
    }
    if (node.nodeType !== 1) {
      return
    }
    _position = window.getComputedStyle(node)['position']

    // position=static: 继续递归父节点
    if (typeof (init) === 'undefined' && _position === 'static') {
      getOffset(node.parentNode)
      return
    }
    offest.top = node.offsetTop + offest.top - node.scrollTop
    offest.left = node.offsetLeft + offest.left - node.scrollLeft

    // position = fixed: 获取值后退出递归
    if (_position === 'fixed') {
      return
    }

    getOffset(node.parentNode)
  }
}

export function getPosition (el) {
  let xPos = 0
  let yPos = 0
  while (el) {
    if (el.tagName === 'BODY') {
      // deal with browser quirks with body/window/document and page scroll
      let xScroll = el.scrollLeft || document.documentElement.scrollLeft
      let yScroll = el.scrollTop || document.documentElement.scrollTop
      xPos += (el.offsetLeft - xScroll + el.clientLeft)
      yPos += (el.offsetTop - yScroll + el.clientTop)
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft)
      yPos += (el.offsetTop - el.scrollTop + el.clientTop)
    }
    el = el.offsetParent
  }
  return {
    x: xPos,
    y: yPos
  }
}
window.getPosition = getPosition

export function scrollTop () {
  return document.documentElement.scrollTop || document.body.scrollTop
}
export function scrollLeft () {
  return document.documentElement.scrollLeft || document.body.scrollLeft
}
