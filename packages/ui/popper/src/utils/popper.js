const root = window
const boundariesElement = 'viewport'
export default class Popper {
  /**
   * 获得给定元素的外围尺寸（offset大小 + 外边距）
   * @function
   * @ignore
   * @argument {Element} element 要检测的元素
   * @returns {Object} 包含宽高信息的对象
   */
  getOuterSizes = (element) => {
    // 注：这里会访问 DOM
    const _display = element.style.display
    const _visibility = element.style.visibility
    element.style.display = 'block'
    element.style.visibility = 'hidden'

    // original method
    // 原始方法
    const styles = root.getComputedStyle(element) // 获取计算后的样式
    const x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom) // 上下边距
    const y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight) // 左右边距
    const result = {
      width: element.offsetWidth + y,
      height: element.offsetHeight + x,
    }

    // 重置元素样式
    element.style.display = _display
    element.style.visibility = _visibility
    return result
  }

  /**
   * 获得 popper 的偏移量
   * @method
   * @memberof Popper
   * @access private
   * @param {Element} popper - popper 元素
   * @param {Element} reference - 相关元素（popper 将根据它定位）
   * @returns {Object} 包含将应用于 popper 的位移信息的对象
   */
  getOffsets = (popper, reference, position, placement) => {
    const { getOffsetRectRelativeToCustomParent, getOuterSizes, getOffsetParent } = this
    // 获取前缀
    placement = placement.split('-')[0]
    const popperOffsets = {}

    // 设置 position
    popperOffsets.position = position
    // 判断父元素是否固定定位
    const isParentFixed = popperOffsets.position === 'fixed'

    //
    // 获取相关元素的位置
    //
    const referenceOffsets = getOffsetRectRelativeToCustomParent(
      reference,
      getOffsetParent(popper),
      isParentFixed
    )

    //
    // 获取 popper 的大小
    //
    const popperRect = getOuterSizes(popper)
    //
    // 计算 popper 的偏移
    //
    // 根据 popper 放置位置的不同，我们用不同的方法计算
    if (['right', 'left'].indexOf(placement) !== -1) {
      // 如果在水平方向，应当和相关元素垂直居中对齐
      // top 应当为相关元素的 top 加上二者的高度差的一半，这样才能保证垂直居中对齐
      popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2
      if (placement === 'left') {
        // 如果在左边，则 left 应为相关元素的 left 减去 popper 的宽度
        popperOffsets.left = referenceOffsets.left - popperRect.width
      } else {
        // 如果在右边，则 left 应为相关元素的 right
        popperOffsets.left = referenceOffsets.right
      }
    } else {
      // 如果在垂直方向，应当和相关元素水平居中对齐
      // left 应当为相关元素的 left 加上二者的宽度差的一半
      popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2
      if (placement === 'top') {
        // 如果在上边，则 top 应当为相关元素的 top 减去 popper 的高度
        popperOffsets.top = referenceOffsets.top - popperRect.height
      } else {
        // 如果在下边，则 top 应当为 相关元素的 bottom
        popperOffsets.top = referenceOffsets.bottom
      }
    }

    // 给 popperOffsets 对象增加宽度和高度值
    popperOffsets.width = popperRect.width
    popperOffsets.height = popperRect.height

    return {
      popper: popperOffsets, // popper 的相关信息
      reference: referenceOffsets, // 相关元素的相关信息
    }
  }

  /**
   * 为给定的 popper 设定样式
   * @function
   * @ignore
   * @argument {Element} element - 要设定样式的元素
   * @argument {Object} styles - 包含样式信息的对象
   */
  setStyle = (element, styles) => {
    function isNumeric(n) {
      // 是否是数字
      return n !== '' && !isNaN(parseFloat(n)) && isFinite(n)
    }
    Object.keys(styles).forEach(function (prop) {
      let unit = ''
      // 为如下的属性增加单位
      if (
        ['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 &&
        isNumeric(styles[prop])
      ) {
        unit = 'px'
      }
      element.style[prop] = styles[prop] + unit
    })
  }

  /**
   * 初始化更新 popper 位置时用到的事件监听器
   * @method
   * @memberof Popper
   * @access private
   */
  setupEventListeners = (element, callback) => {
    // 1 DOM access here
    // 注：这里会访问 DOM，原作者回复我说，这是他用来记录哪里访问到了 DOM
    // this.state.updateBound = this.update.bind(this)
    // 浏览器窗口改变的时候更新边界
    this.scrollCallback = () => {
      callback(target)
    }
    root.addEventListener('resize', this.scrollCallback)
    // 如果边界元素是窗口，就不需要监听滚动事件
    if (boundariesElement !== 'window') {
      var target = this.getScrollParent(element) // 获取相关元素可滚动的父级
      // 这里可能是 `body` 或 `documentElement`（Firefox上），等价于要监听根元素
      if (target === root.document.body || target === root.document.documentElement) {
        target = root
      }
      // 监听滚动事件
      target.addEventListener('scroll', this.scrollCallback)
    }
  }

  getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null
  }

  isBody = (element) => {
    const { getNodeName } = this
    return element ? ['html', 'body', '#document'].includes(getNodeName(element)) : true
  }

  /**
   * 返回给定元素用来计算滚动的父元素
   * @function
   * @ignore
   * @argument {Element} element
   * @returns {Element} scroll parent
   */
  getScrollParent = (element) => {
    // return document.body

    const { getStyleComputedProperty, getScrollParent, getNodeName } = this
    const parent = element.parentNode
    if (['html', 'body', '#document'].includes(getNodeName(element))) {
      // $FlowFixMe: assume body is always available
      return document.documentElement || document.body
    }
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
      ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 ||
      ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 ||
      ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1
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
  isFixed = (element) => {
    const { getStyleComputedProperty, isFixed, getNodeName } = this

    if (['html', 'body', '#document'].includes(getNodeName(element))) {
      // $FlowFixMe: assume body is always available
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
  getStyleComputedProperty = (element, property) => {
    // 注：这里会访问 DOM
    const css = window.getComputedStyle(element, null)
    return css[property]
  }

  _getPosition = (popper, reference) => {
    const { getOffsetParent, isFixed } = this
    const container = getOffsetParent(reference) // 获取父元素的偏移

    if (this._options.forceAbsolute) {
      // 强制使用绝对定位
      return 'absolute'
    }

    // 判断 popper 是否使用固定定位
    // 如果相关元素位于固定定位的元素中，popper 也应当使用固定固定定位来使它们可以同步滚动
    const isParentFixed = isFixed(reference, container)
    return isParentFixed ? 'fixed' : 'absolute'
  }

  getOffsetParent = (element) => {
    // 注：这里会访问 DOM
    const offsetParent = element.offsetParent
    return offsetParent === root.document.body || !offsetParent
      ? root.document.documentElement
      : offsetParent
  }

  getOffsetRectRelativeToCustomParent = (element, parent, fixed) => {
    const { getScrollParent, getBoundingClientRect } = this
    const elementRect = getBoundingClientRect(element)
    const parentRect = getBoundingClientRect(parent)

    if (fixed) {
      // 固定定位
      const scrollParent = getScrollParent(parent)
      parentRect.top += scrollParent.scrollTop
      parentRect.bottom += scrollParent.scrollTop
      parentRect.left += scrollParent.scrollLeft
      parentRect.right += scrollParent.scrollLeft
    }

    const rect = {
      top: elementRect.top - parentRect.top,
      left: elementRect.left - parentRect.left,
      bottom: elementRect.top - parentRect.top + elementRect.height,
      right: elementRect.left - parentRect.left + elementRect.width,
      width: elementRect.width,
      height: elementRect.height,
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
  getBoundingClientRect = (element) => {
    const rect = element.getBoundingClientRect()

    // IE11以下
    const isIE = navigator.userAgent.indexOf('MSIE') !== -1

    // 修复 IE 的文档的边界 top 值总是 0 的bug
    const rectTop = isIE && element.tagName === 'HTML' ? -element.scrollTop : rect.top

    return {
      left: rect.left,
      top: rectTop,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.right - rect.left,
      height: rect.bottom - rectTop,
    }
  }

  /**
   * 移除更新 popper 位置时用到的事件监听器
   * @method
   * @memberof Popper
   * @access private
   */
  removeEventListeners = (element) => {
    const { getScrollParent } = this

    // 注：这里会访问 DOM
    // 移除 resize 事件监听
    root.removeEventListener('resize', this.scrollCallback)
    if (boundariesElement !== 'window') {
      // 如果边界元素不是窗口，说明还监听了滚动事件
      let target = getScrollParent(element)
      if (target === root.document.body || target === root.document.documentElement) {
        target = root
      }
      // 移除滚动事件监听
      target.removeEventListener('scroll', this.scrollCallback)
    }
    // 更新回调摄者为空
    this.scrollCallback = null
  }
  /**
   * 防止overlay的合适的位置位置  在auto时候有效
   * @method
   * @memberof Popper
   * @ignore
   * @argument {Eement} element 给定的元素
   * @argument {String} property 属性
   */
}
