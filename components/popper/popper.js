var root = window
var boundariesElement = 'viewport'
/**
   * 初始化更新 popper 位置时用到的事件监听器
   * @method
   * @memberof Popper
   * @access private
   */
export const setupEventListeners = (element, callback) => {
  // 1 DOM access here
  // 注：这里会访问 DOM，原作者回复我说，这是他用来记录哪里访问到了 DOM
  // this.state.updateBound = this.update.bind(this)
  // 浏览器窗口改变的时候更新边界
  root.addEventListener('resize', () => {
    callback(target)
  })
  // 如果边界元素是窗口，就不需要监听滚动事件
  if (boundariesElement !== 'window') {
    var target = getScrollParent(element) // 获取相关元素可滚动的父级
    // 这里可能是 `body` 或 `documentElement`（Firefox上），等价于要监听根元素
    if (
      target === root.document.body ||
        target === root.document.documentElement
    ) {
      target = root
    }
    // 监听滚动事件
    target.addEventListener('scroll', (e) => {
      callback(target)
    })
  }
}

/**
   * 返回给定元素用来计算滚动的父元素
   * @function
   * @ignore
   * @argument {Element} element
   * @returns {Element} scroll parent
   */
export const getScrollParent = (element) => {
  var parent = element.parentNode

  if (!parent) {
    // 没有父级
    return element
  }

  if (parent === root.document) {
    // Firefox 会将 scrollTop的判断放置的 `documentElement` 而非 `body` 上
    // 我们将判断二者谁大于0来返回正确的元素
    if (root.document.body.scrollTop) {
      return root.document.body
    } else {
      return root.document.documentElement
    }
  }

  // Firefox 要求我们也要检查 `-x` 以及 `-y`
  if (
    ['scroll', 'auto'].indexOf(
      getStyleComputedProperty(parent, 'overflow')
    ) !== -1 ||
      ['scroll', 'auto'].indexOf(
        getStyleComputedProperty(parent, 'overflow-x')
      ) !== -1 ||
      ['scroll', 'auto'].indexOf(
        getStyleComputedProperty(parent, 'overflow-y')
      ) !== -1
  ) {
    // 如果检测到的 scrollParent 是 body，我们将对其父元素做一次额外的检测
    // 这样在 Chrome 系的浏览器中会得到 body，其他情况下会得到 documentElement
    // 修复 issue #65
    return parent
  }
  return getScrollParent(element.parentNode)
}

/**
   * 判断给定元素是否固定或者在一个固定元素中
   * @function
   * @ignore
   * @argument {Element} element 给定的元素
   * @argument {Element} customContainer 自定义的容器
   * @returns {Boolean}
   */
export const isFixed = (element) => {
  if (element === window.document.body) {
    // body 返回 false
    return false
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    // position 为 fixed
    return true
  }
  // 判断父元素是否固定
  return element.parentNode ? isFixed(element.parentNode) : element
}
/**
   * 获取给定元素的 CSS 计算属性
   * @function
   * @ignore
   * @argument {Eement} element 给定的元素
   * @argument {String} property 属性
   */
export const getStyleComputedProperty = (element, property) => {
  // 注：这里会访问 DOM
  const css = window.getComputedStyle(element, null)
  return css[property]
}

export const _getPosition = (popper, reference) => {
  var container = getOffsetParent(reference) // 获取父元素的偏移

  if (this._options.forceAbsolute) {
    // 强制使用绝对定位
    return 'absolute'
  }

  // 判断 popper 是否使用固定定位
  // 如果相关元素位于固定定位的元素中，popper 也应当使用固定固定定位来使它们可以同步滚动
  var isParentFixed = isFixed(reference, container)
  return isParentFixed ? 'fixed' : 'absolute'
}

export const getOffsetParent = (element) => {
  // 注：这里会访问 DOM
  var offsetParent = element.offsetParent
  return offsetParent === root.document.body || !offsetParent
    ? root.document.documentElement
    : offsetParent
}
export const getOffsetRectRelativeToCustomParent = (element, parent, fixed) => {
  var elementRect = getBoundingClientRect(element)
  var parentRect = getBoundingClientRect(parent)

  if (fixed) {
    // 固定定位
    var scrollParent = getScrollParent(parent)
    parentRect.top += scrollParent.scrollTop
    parentRect.bottom += scrollParent.scrollTop
    parentRect.left += scrollParent.scrollLeft
    parentRect.right += scrollParent.scrollLeft
  }

  var rect = {
    top: elementRect.top - parentRect.top,
    left: elementRect.left - parentRect.left,
    bottom: elementRect.top - parentRect.top + elementRect.height,
    right: elementRect.left - parentRect.left + elementRect.width,
    width: elementRect.width,
    height: elementRect.height
  }
  return rect
}
/**
   * Get bounding client rect of given element
   * 获取给定元素的边界
   * @function
   * @ignore
   * @param {HTMLElement} element
   * @return {Object} client rect
   */
export const getBoundingClientRect = (element) => {
  var rect = element.getBoundingClientRect()

  // IE11以下
  var isIE = navigator.userAgent.indexOf('MSIE') !== -1

  // 修复 IE 的文档的边界 top 值总是 0 的bug
  var rectTop =
      isIE && element.tagName === 'HTML' ? -element.scrollTop : rect.top

  return {
    left: rect.left,
    top: rectTop,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.right - rect.left,
    height: rect.bottom - rectTop
  }
}
