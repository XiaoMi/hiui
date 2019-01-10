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
