import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import PopperJS from './utils/popper'
import { getOffset } from './utils/positionUtils'
import useClickOutside from './utils/useClickOutside'
import './style/index'

const {
  isFixed,
  setupEventListeners,
  removeEventListeners,
  setStyle,
  getStyleComputedProperty,
  isBody
} = new PopperJS()

const Overlay = (props) => {
  const {
    show,
    attachEle,
    children,
    className,
    height,
    zIndex,
    onMouseOver,
    onMouseOut,
    onMouseEnter,
    onMouseLeave,
    onClickOutside,
    overlayClassName
  } = props
  const [isAddevent, setIsAddevent] = useState(false)
  const [state, setState] = useState({
    offset: undefined,
    popperHeight: undefined,
    popperWidth: undefined,
    cacheContainerPosition: 'static',
    popperRef: undefined
  })

  let popperHeight
  let popperWidth
  const staticPopperRef = useRef()
  const offsetData = useRef()
  let popperContainerRef

  if (onClickOutside) {
    popperContainerRef = useClickOutside(
      (e) => {
        onClickOutside && onClickOutside(e)
      },
      undefined,
      'click',
      attachEle
    )
  }

  const scrollCallBack = useCallback(() => {
    const offset = getOffset(props, state, 3)
    offsetData.current = offset
    if (staticPopperRef) {
      setState(
        Object.assign({}, state, {
          popperRef: staticPopperRef.current
        })
      )
    }
  }, [props, state])

  useEffect(() => {
    const { attachEle, container, show } = props
    const { cacheContainerPosition } = state
    if (!show) {
      // 删除滚动
      attachEle && isAddevent && removeEventListeners(attachEle)
      // 判断该元素中是否含有popper如果有popper在显示  就不要删除定位
      setTimeout(() => {
        if (container.querySelectorAll('.hi-popper__container').length === 0) {
          container && !isBody(container) && isAddevent && setStyle(container, { position: cacheContainerPosition })
        }
      }, 0)
      setIsAddevent(false)
      setState(Object.assign({}, state, { offset: undefined }))
    }
  }, [props.show])

  // update
  useEffect(() => {
    const { attachEle, children, container, show } = props
    if (!(attachEle && show && children)) return

    const { cacheContainerPosition, popperRef } = state
    if (show && !isAddevent) {
      !isAddevent && setupEventListeners(attachEle, scrollCallBack)
      setIsAddevent(true)
    }
    // 如果在一个固定定位的元素里面的话；更改计算方式
    if (isFixed(attachEle) && !isBody(container)) {
      cacheContainerPosition === 'static' && setStyle(container, { position: 'relative' })
    }
    if (!popperRef) {
      setState(
        Object.assign({}, state, {
          popperRef: staticPopperRef.current,
          popperHeight: staticPopperRef.current.clientHeight,
          popperWidth: staticPopperRef.current.clientWidth
        })
      )
    }
  })

  useEffect(() => {
    const offset = getOffset(props, state, 2)
    offsetData.current = offset

    state.popperRef &&
      setState(
        Object.assign({}, state, {
          offset: offset
        })
      )
  }, [state.popperRef])
  // DidMount
  useEffect(() => {
    const { container } = props
    setState(
      Object.assign({}, state, {
        cacheContainerPosition: container ? getStyleComputedProperty(container, 'position') : 'static'
      })
    )
  }, [])

  if (!(attachEle && show && children)) return null

  const { offset = getOffset(props, state, 1) } = state
  const width = offset.width
  const left = offset.left + 'px'
  const top = offset.top + 'px'
  return (
    <div
      ref={popperContainerRef}
      className={classNames(overlayClassName, 'hi-popper__container', {
        'hi-popper__container--hide': !show
      })}
      style={{ left, top, zIndex }}
    >
      <div
        ref={(node) => {
          staticPopperRef.current = node
        }}
        className={classNames(className, 'hi-popper__content', `hi-popper__content--${offset.placement}`, {
          'hi-popper__content--hide': popperHeight === 0 || popperWidth === 0
        })}
        style={{ width, height }}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </div>
    </div>
  )
}
Overlay.defaultProps = {
  show: false,
  topGap: 0,
  leftGap: 0,
  zIndex: 1060,
  placement: 'bottom-start'
}

Overlay.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]), // 为false时不设置
  height: PropTypes.number,
  className: PropTypes.string,
  show: PropTypes.bool,
  topGap: PropTypes.number,
  leftGap: PropTypes.number,
  zIndex: PropTypes.number,
  placement: PropTypes.oneOf([
    'auto', // 会计算最合适的位置
    'bottom',
    'bottom-start',
    'bottom-end',
    'top',
    'top-start',
    'top-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
    'top-bottom-start',
    'top-bottom',
    'left-right',
    'left-right-start'
  ]),
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  container: PropTypes.any,
  preventOverflow: PropTypes.bool // 防止溢出  top bottom
}
export default Overlay
