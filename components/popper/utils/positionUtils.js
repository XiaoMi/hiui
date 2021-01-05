import PopperJS from './popper'

const { isBody, isFixed, getOffsetRectRelativeToCustomParent } = new PopperJS()
// 上下防止溢出 就会定位到划出的边缘位置
const overflowOffset = (placement, scrollTop, rect, top, left, width, props) => {
  const { topGap, container } = props
  let _top = top
  switch (placement) {
    case 'bottom-start':
      _top = rect.top + rect.height + topGap <= 0 ? scrollTop + topGap : top
      break
    case 'top-start':
      if (container.clientHeight + rect.height - rect.bottom <= 0) {
        _top = top - (rect.top - container.clientHeight)
      }
      break
  }
  return {
    top: _top,
    width,
    left,
    placement
  }
}
// 对于auto的计算方式
const positionAuto = (attachEleRect, popperHeight, popperRef, height, containerHeight) => {
  // auto时候 定位比较合适的位置
  let placement = 'bottom-start'
  popperHeight === undefined && (popperHeight = 0)
  const width = popperRef ? popperRef.clientWidth : 0

  if (popperRef || height) {
    height && (popperHeight = height)
  } else if (popperRef && popperRef.clientHeight && popperHeight !== popperRef.clientHeight) {
    popperHeight = popperRef.clientHeight
  }
  // 上下都放不下的时候 放左右
  if (attachEleRect.top + popperHeight + attachEleRect.height > containerHeight) {
    if (attachEleRect.right > width) {
      placement = 'right'
    }
    if (attachEleRect.left > width) {
      placement = 'left'
    }
  } else if (attachEleRect.top < popperHeight) {
    if (attachEleRect.right > width) {
      placement = 'right'
    }
    if (attachEleRect.left > width) {
      placement = 'left'
    }
  }
  // 上下能放下的时候以上下优先放置

  if (attachEleRect.top > popperHeight) {
    placement = 'top-start'
  }
  if (attachEleRect.top + popperHeight + attachEleRect.height < containerHeight) {
    placement = 'bottom-start'
  }
  return placement
}
const caclLeftOrRightPlacement = (leftPlacement, RightPlacement, popperRef, widthConstant) => {
  let { width, popperWidth, poperLeft, containerWidth, attachEleWidth } = widthConstant
  // 计算popper在元素上面或下面
  let placement = RightPlacement
  popperWidth === undefined && (popperWidth = 0) // 自动探测边界，第一次时需设置为不可见，否则会闪跳,用来设置class hi-popper__content--hide
  if (popperRef || width) {
    // 元素已挂载到dom且当前popper处于显示状态
    if (width) {
      popperWidth = width
    } else if (popperRef.clientWidth && popperWidth !== popperRef.clientWidth) {
      popperWidth = popperRef.clientWidth
    }
    poperLeft = poperLeft + (popperWidth - (attachEleWidth || 0))
    if (poperLeft >= containerWidth) {
      placement = leftPlacement
    }
  }
  return placement
}
const caclBottomOrTopPlacement = (bottomPlacement, topPlacement, popperRef, heightConstant, widthConstant) => {
  let { popperHeight, height, poperTop, containerHeight } = heightConstant
  // 计算popper在元素上面或下面
  let placement = bottomPlacement
  popperHeight === undefined && (popperHeight = 0) // 自动探测边界，第一次时需设置为不可见，否则会闪跳,用来设置class hi-popper__content--hide
  if (popperRef || height) {
    // 元素已挂载到dom且当前popper处于显示状态
    if (height) {
      popperHeight = height
    } else if (popperRef.clientHeight && popperHeight !== popperRef.clientHeight) {
      popperHeight = popperRef.clientHeight
    }
    poperTop += popperHeight
    if (poperTop >= containerHeight) {
      placement = topPlacement
    }
  }
  const topOrbottom = placement === 'top-start' ? 'top' : 'bottom'
  placement = topOrbottom + '-' + caclLeftOrRightPlacement('end', 'start', popperRef, widthConstant)
  return placement
}
const getPlacement = (attachEleRect, container, props, state, attachEleWidth) => {
  const { popperHeight, popperRef, popperWidth } = state
  let { attachEle, placement, height, width = 0, leftGap = 0 } = props

  if (!attachEle) return
  let containerHeight = document.documentElement.clientHeight || document.body.clientHeight
  let containerWidth = document.documentElement.clientWidth || document.body.clientWidth

  if (isFixed(attachEle)) {
    containerHeight = container.clientHeight
    containerWidth = container.clientWidth
  }
  if (isBody(container)) {
    containerHeight = document.documentElement.clientHeight || document.body.clientHeight
    containerWidth = document.documentElement.clientWidth || document.body.clientWidth
  }

  const poperTop = attachEleRect.top + attachEleRect.height
  const poperLeft = attachEleRect.left + attachEleRect.width

  const widthConstant = {
    width,
    popperWidth,
    poperLeft,
    containerWidth,
    attachEleWidth,
    leftGap
  }
  const heightConstant = {
    popperHeight,
    height,
    poperTop,
    containerHeight,
    leftGap
  }

  if (placement === 'top-bottom-start') {
    placement = caclBottomOrTopPlacement('bottom-start', 'top-start', popperRef, heightConstant, widthConstant)
  } else if (placement === 'top-bottom') {
    placement = caclBottomOrTopPlacement('bottom', 'top', popperRef, heightConstant, widthConstant)
  } else if (placement === 'left-right-start') {
    placement = caclLeftOrRightPlacement('left-start', 'right-start', popperRef, widthConstant)
  } else if (placement === 'left-right') {
    placement = caclLeftOrRightPlacement('left', 'right', popperRef, width, widthConstant)
  } else if (placement === 'auto') {
    positionAuto(attachEleRect, popperHeight, popperRef, height, containerHeight)
  }
  return placement || 'bottom-start'
}
export const getOffset = (props, state, status) => {
  let { attachEle, topGap, leftGap, width, container, preventOverflow } = props
  if (!attachEle) return

  const { popperHeight, popperWidth } = state
  let rect = attachEle.getBoundingClientRect()

  if (isFixed(attachEle) && !isBody(container)) {
    rect = getOffsetRectRelativeToCustomParent(attachEle, container, isFixed(attachEle))
  }

  let _scrollTop = container.scrollTop
  let _scrollLeft = container.scrollLeft
  // 兼容处理
  if (isBody(container)) {
    _scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    _scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
  }

  let top = rect.top + _scrollTop
  let left = rect.left + _scrollLeft

  width = width === false ? popperWidth : width === undefined ? rect.width : width
  const _width = width
  let placement = getPlacement(rect, container, props, state, rect.width) || 'bottom-start'
  const rectHeight = rect.height
  switch (placement) {
    case 'bottom':
      top = top + topGap + rectHeight
      left = left + leftGap + rect.width / 2
      break
    case 'bottom-start':
      top = top + topGap + rectHeight
      left = left + leftGap
      break
    case 'bottom-end':
      top = top + topGap + rectHeight
      left = left + leftGap - width + rect.width
      break
    case 'top':
      top = top - topGap
      left = left + leftGap + rect.width / 2
      break
    case 'top-start':
      top = top - topGap
      left = left + leftGap
      break
    case 'top-end':
      top = top - topGap
      left = left + leftGap - width + rect.width
      break
    case 'left':
      top = top + rect.height / 2
      left = left - leftGap
      break
    case 'left-start':
      top = top + topGap
      left = left - width
      break
    case 'left-end':
      top = top + rect.height - topGap - popperHeight
      left = left - width
      break

    case 'right':
      top = top + rect.height / 2
      left = left + rect.width + leftGap
      break
    case 'right-start':
      top = top + topGap
      left = left + rect.width + leftGap
      break
    case 'right-end':
      top = top + rect.height - topGap - popperHeight
      left = left + width + leftGap
      break
  }

  if (preventOverflow) {
    return overflowOffset((placement = 'bottom-start'), _scrollTop, rect, top, left, width, props)
  }

  return {
    width: _width,
    top,
    left,
    placement: placement
  }
}
