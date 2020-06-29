import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PopperJS from './utils/popper'
import { getOffset } from './utils/positionUtils'
import './style/index'
const {
  isBody,
  isFixed,
  setupEventListeners,
  removeEventListeners,
  setStyle,
  getStyleComputedProperty
} = new PopperJS()

export default class Overlay extends Component {
  popperHeight = undefined
  popperWidth = undefined
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
      popperWidth: undefined,
      cacheContainerPosition: 'static',
      popperRef: undefined
    }
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    const { attachEle, container, show } = nextProps
    const { isAddevent, cacheContainerPosition } = prevState
    if (!show) {
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
        offset: undefined
      }
    }
    return null
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

    if (show && !isAddevent && (isFixed(attachEle) || !isBody(container))) {
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
        popperRef: this.popperRef,
        popperHeight: this.popperRef.clientHeight,
        popperWidth: this.popperRef.clientWidth
      })
    }
  }

  scrollCallBack = () => {
    const { props, state } = this
    this.setState({
      offset: getOffset(props, state)
    })
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
    const { offset = getOffset(this.props, this.state) } = this.state
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
            {
              'hi-popper__content--hide':
                this.popperHeight === 0 || this.popperWidth === 0
            }
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
