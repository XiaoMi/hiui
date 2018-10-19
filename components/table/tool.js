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
    pos.left += obj.offsetLeft
    pos.top += obj.offsetTop
    obj = obj.parentNode
  }
  return pos
}
export function offset (obj) {
  let pos = {left: 0, top: 0}
  while (obj.parentNode) {
    if ([document, document.body, document].includes(obj)) {
      return pos
    }
    pos.left += obj.offsetLeft
    pos.top += obj.offsetTop
    obj = obj.parentNode
    let sty = getStyle(obj, 'position')

    if (sty === 'absolute' || sty === 'relative' || sty === 'fixed') {
      return pos
    }
  }
  return pos
}

export function scrollTop () {
  return document.documentElement.scrollTop || document.body.scrollTop
}
export function scrollLeft () {
  return document.documentElement.scrollLeft || document.body.scrollLeft
}
