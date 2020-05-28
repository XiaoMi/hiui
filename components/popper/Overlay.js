import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PopperJS from './Popper'
import './style/index'
const {
  isBody,
  isFixed,
  setupEventListeners,
  removeEventListeners,
  setStyle,
  getStyleComputedProperty,
  getOffsetRectRelativeToCustomParent
} = new PopperJS()

export default class Overlay extends Component {
  popperHeight = undefined

  static propTypes = {
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number
    ]), // 为false时不设置
    height: PropTypes.number,
    className: PropTypes.string,
    show: PropTypes.bool,
    topGap: PropTypes.number,
    leftGap: PropTypes.number,
    zIndex: PropTypes.number,
    placement: PropTypes.oneOf([
      'bottom',
      'bottom-start',
      'top',
      'top-start',
      'left',
      'right',
      'right-start',
      'top-bottom-start',
      'top-bottom'
    ]),
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
  }

  static defaultProps = {
    show: false,
    topGap: 2,
    leftGap: 2,
    zIndex: 1060,
    placement: 'bottom-start'
  }
  constructor (props) {
    super(props)
    this.state = {
      offset: undefined,
      isAddevent: false,
      popperHeight: undefined,
      cacheContainerPosition: 'static',
      popperRef: undefined
    }
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    const { attachEle, container } = nextProps
    const { isAddevent, cacheContainerPosition } = prevState
    if (!nextProps.show) {
      // 删除滚动
      attachEle && isAddevent && removeEventListeners(attachEle)
      // 判断该元素中是否含有popper如果有popper在显示  就不要删除定位
      setTimeout(() => {
        if (container.querySelectorAll('.hi-popper__container').length === 0) {
          container &&
            isAddevent &&
            setStyle(container, { position: cacheContainerPosition })
        }
      }, 0)

      return {
        isAddevent: false,
        offset: undefined,
        container: container
      }
    }
    if (nextProps.show) {
    }
    return {
      container: container
    }
  }
  componentDidMount () {
    const { container } = this.props
    this.setState({
      cacheContainerPosition: container
        ? getStyleComputedProperty(container, 'position')
        : 'static'
    })
  }
  componentDidUpdate () {
    let { attachEle, show, children, container } = this.props
    if (!(attachEle && show && children)) return
    const { isAddevent, cacheContainerPosition, popperRef } = this.state

    if (show && !isAddevent && isFixed(attachEle)) {
      setupEventListeners(attachEle, this.scrollCallBack.bind(this))
      this.setState({
        isAddevent: true
      })
    }
    // 如果在一个固定定位的元素里面的话；更改计算方式
    if (isFixed(attachEle) || !isBody(container)) {
      cacheContainerPosition === 'static' &&
        setStyle(container, { position: 'relative' })
    }
    if (!popperRef) {
      this.setState({
        popperRef: this.popperRef
      })
    }
  }

  scrollCallBack = () => {
    this.setState({
      offset: this.getOffset()
    })
  }

  getOffset = () => {
    let { attachEle, topGap, leftGap, width, container } = this.props

    if (!attachEle) return
    const { cacheContainerPosition } = this.state
    let rect = attachEle.getBoundingClientRect()
    if (isFixed(attachEle) || !isBody(container)) {
      rect = getOffsetRectRelativeToCustomParent(
        attachEle,
        container,
        cacheContainerPosition
      )
    }
    let top = rect.top + container.scrollTop
    let left = rect.left + container.scrollLeft
    width =
      width === false ? undefined : width === undefined ? rect.width : width
    let placement = this.getPlacement(rect, container)

    switch (placement) {
      case 'bottom':
        top = top + topGap + rect.height
        left = left + leftGap + rect.width / 2
        break
      case 'bottom-start':
        top = top + topGap + rect.height
        left = left + leftGap
        break
      case 'bottom-end':
        top = top + topGap + rect.height
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

      case 'right':
        top = top + rect.height / 2
        left = left + rect.width + leftGap
        break
      case 'right-start':
        top = top + topGap
        left = left + rect.width + leftGap
        break
    }
    return {
      width,
      top,
      left,
      placement
    }
  }

  getPlacement (attachEleRect, container) {
    let { attachEle, placement, height } = this.props

    if (!attachEle) return
    let containerHeight =
      document.documentElement.clientHeight || document.body.clientHeight
    if (isFixed(attachEle)) {
      containerHeight = container.clientHeight || container.clientHeight
    }
    let poperTop = attachEleRect.top + attachEleRect.height
    const caclPlacement = (bottomPlacement, topPlacement) => {
      // 计算popper在元素上面或下面
      placement = bottomPlacement
      this.popperHeight === undefined && (this.popperHeight = 0) // 自动探测边界，第一次时需设置为不可见，否则会闪跳,用来设置class hi-popper__content--hide
      if (this.popperRef || height) {
        // 元素已挂载到dom且当前popper处于显示状态
        if (height) {
          this.popperHeight = height
        } else if (
          this.popperRef.clientHeight &&
          this.popperHeight !== this.popperRef.clientHeight
        ) {
          this.popperHeight = this.popperRef.clientHeight
        }
        poperTop += this.popperHeight
        if (poperTop >= containerHeight) {
          placement = topPlacement
        }
      }
    }

    if (placement === 'top-bottom-start') {
      caclPlacement('bottom-start', 'top-start')
    } else if (placement === 'top-bottom') {
      caclPlacement('bottom', 'top')
    }

    return placement
  }

  render () {
    let {
      attachEle,
      children,
      className,
      show,
      height,
      zIndex,
      onMouseOver,
      onMouseOut,
      onMouseEnter,
      onMouseLeave
    } = this.props

    if (!(attachEle && show && children)) return null
    const { offset = this.getOffset() } = this.state
    let width = offset.width
    let left = offset.left + 'px'
    let top = offset.top + 'px'

    return (
      <div
        className={classNames('hi-popper__container', {
          'hi-popper__container--hide': !show
        })}
        style={{ left, top, zIndex }}
      >
        <div
          ref={node => {
            this.popperRef = node
          }}
          className={classNames(
            className,
            'hi-popper__content',
            `hi-popper__content--${offset.placement}`,
            { 'hi-popper__content--hide': this.popperHeight === 0 }
          )}
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
}
