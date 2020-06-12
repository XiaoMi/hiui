import PopperJS from './popper'

const { isBody, isFixed, getOffsetRectRelativeToCustomParent } = new PopperJS()
// 上下防止溢出
const overflowOffset = (
  placement,
  scrollTop,
  rect,
  top,
  left,
  width,
  props
) => {
  let { topGap, container } = props
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
const positionAuto = (
  attachEleRect,
  popperHeight,
  popperRef,
  height,
  containerHeight
) => {
  // auto时候 定位比较合适的位置
  let placement = 'bottom-start'
  popperHeight === undefined && (popperHeight = 0)
  let width = popperRef ? popperRef.clientWidth : 0

  if (popperRef || height) {
    height && (popperHeight = height)
  } else if (
    popperRef &&
    popperRef.clientHeight &&
    popperHeight !== popperRef.clientHeight
  ) {
    popperHeight = popperRef.clientHeight
  }
  // 上下都放不下的时候 放左右
  if (
    attachEleRect.top + popperHeight + attachEleRect.height >
    containerHeight
  ) {
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
  if (
    attachEleRect.top + popperHeight + attachEleRect.height <
    containerHeight
  ) {
    placement = 'bottom-start'
  }
  return placement
}
const getPlacement = (attachEleRect, container, props, state) => {
  let { popperHeight, popperRef } = state
  let { attachEle, placement, height, width = 0, leftGap = 0 } = props

  if (!attachEle) return
  let containerHeight =
    document.documentElement.clientHeight || document.body.clientHeight

  if (isFixed(attachEle) || !isBody(container)) {
    containerHeight = container.clientHeight
  }
  if (isBody(container)) {
    containerHeight =
      document.documentElement.clientHeight || document.body.clientHeight
  }

  let poperTop = attachEleRect.top + attachEleRect.height
  const caclBottomOrTopPlacement = (bottomPlacement, topPlacement) => {
    // 计算popper在元素上面或下面
    placement = bottomPlacement
    popperHeight === undefined && (popperHeight = 0) // 自动探测边界，第一次时需设置为不可见，否则会闪跳,用来设置class hi-popper__content--hide
    if (popperRef || height) {
      // 元素已挂载到dom且当前popper处于显示状态
      if (height) {
        popperHeight = height
      } else if (
        popperRef.clientHeight &&
        popperHeight !== popperRef.clientHeight
      ) {
        popperHeight = popperRef.clientHeight
      }
      poperTop += popperHeight
      if (poperTop >= containerHeight) {
        placement = topPlacement
      }
    }
  }
  const caclLeftOrRightPlacement = (leftPlacement, RightPlacement) => {
    // 计算popper在元素上面或下面
    placement = leftPlacement
    let _width = popperRef ? popperRef.clientWidth : width
    if (attachEleRect.right > _width + leftGap) {
      placement = RightPlacement
    }
    if (attachEleRect.left > _width + leftGap) {
      placement = leftPlacement
    }
  }

  if (placement === 'top-bottom-start') {
    caclBottomOrTopPlacement('bottom-start', 'top-start')
  } else if (placement === 'top-bottom') {
    caclBottomOrTopPlacement('bottom', 'top')
  } else if (placement === 'left-right-start') {
    caclLeftOrRightPlacement('left-start', 'right-start')
  } else if (placement === 'left-right') {
    caclLeftOrRightPlacement('left', 'right')
  } else if (placement === 'auto') {
    positionAuto(
      attachEleRect,
      popperHeight,
      popperRef,
      height,
      containerHeight
    )
  }
  return placement
}
export const getOffset = (props, state) => {
  let { attachEle, topGap, leftGap, width, container, preventOverflow } = props
  if (!attachEle) return

  const { popperHeight, popperWidth } = state
  let rect = attachEle.getBoundingClientRect()

  if (isFixed(attachEle) || !isBody(container)) {
    rect = getOffsetRectRelativeToCustomParent(
      attachEle,
      container,
      isFixed(attachEle)
    )
  }

  let _scrollTop = container.scrollTop
  let _scrollLeft = container.scrollLeft
  // 兼容处理
  if (isBody(container)) {
    _scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    _scrollLeft =
      document.documentElement.scrollLeft || document.body.scrollLeft
  }

  let top = rect.top + _scrollTop
  let left = rect.left + _scrollLeft
  width = width === false ? popperWidth : width === undefined ? rect.width : width

  let placement = getPlacement(rect, container, props, state)
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
      left = left - rect.width
      break
    case 'left-end':
      top = top + rect.height - topGap - popperHeight
      left = left - rect.width
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
      left = left + rect.width + leftGap
      break
  }
  if (preventOverflow) {
    return overflowOffset(placement, _scrollTop, rect, top, left, width, props)
  }

  return {
    width,
    top,
    left,
    placement
  }
}
