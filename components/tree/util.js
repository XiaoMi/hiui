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
  const current = cur.parentNode.parentNode// li
  const target = tar.parentNode// li
  target.parentNode.insertBefore(current, target)
}
/**
 * 将当前节点移动到目标节点之后
 * @param {ele} cur 当前节点
 * @param {ele} tar 目标节点
 */
export function insAfter (cur, tar) {
  const current = cur.parentNode.parentNode// li
  const target = tar.parentNode// li
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
  const current = cur.parentNode.parentNode// li
  const target = tar.parentNode// li

  if (current === target) return
  if (target.childNodes.length > 1) {
    tar.nextSibling.appendChild(current)
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
};
