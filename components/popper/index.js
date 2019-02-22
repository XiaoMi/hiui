import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'

export default class Popper extends Component {
  container = undefined
  popperHeight = undefined

  static propTypes = {
    // attachEle: PropTypes.oneOfType([
    //   PropTypes.node
    // ]).isRequired,
    width: PropTypes.string,
    height: PropTypes.number,
    className: PropTypes.string,
    show: PropTypes.bool,
    topGap: PropTypes.number,
    leftGap: PropTypes.number,
    zIndex: PropTypes.number,
    placement: PropTypes.oneOf(['bottom', 'bottom-start', 'top', 'top-start', 'left', 'right', 'top-bottom-start', 'top-bottom'])
  }

  static defaultProps = {
    show: false,
    topGap: 2,
    leftGap: 0,
    zIndex: 1060,
    placement: 'bottom-start'
  }

  componentDidUpdate (prevProps) {
    if (prevProps.show !== this.props.show || this.props.show) {
      render(this.renderChildren(), this.container)
    }
  }

  componentDidMount () {
    this.getContainer()
  }

  componentWillUnmount () {
    document.body.removeChild(this.container)
  }

  getOffset () {
    let {
      attachEle,
      topGap,
      leftGap,
      width,
      placement
    } = this.props
    const rect = attachEle.getBoundingClientRect()
    let top = rect.top + (document.documentElement.scrollTop || document.body.scrollTop)
    let left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft)
    width = width === undefined ? rect.width : width
    placement = this.getPlacement(rect)

    switch (placement) {
      case 'bottom':
        top = top + topGap + rect.height
        left = left + leftGap + rect.width / 2
        break
      case 'bottom-start':
        top = top + topGap + rect.height
        left = left + leftGap
        break

      case 'top':
        top = top - topGap
        left = left + leftGap + rect.width / 2
        break
      case 'top-start':
        top = top - topGap
        left = left + leftGap
        break

      case 'left':
        top = top + topGap + rect.height / 2
        left = left + leftGap
        break

      case 'right':
        top = top + topGap + rect.height / 2
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

  getPlacement (attachEleRect) {
    let {
      placement,
      height
    } = this.props
    const bodyHeight = document.documentElement.clientHeight || document.body.clientHeight
    let poperTop = attachEleRect.top + attachEleRect.height
    const caclPlacement = (bottomPlacement, topPlacement) => { // 计算popper在元素上面或下面
      placement = bottomPlacement
      this.popperHeight === undefined && (this.popperHeight = 0) // 自动探测边界，第一次时需设置为不可见，否则会闪跳,用来设置class hi-popper__content--hide
      if (this.popperRef || height) { // 元素已挂载到dom且当前popper处于显示状态
        if (height) {
          this.popperHeight = height
        } else if (this.popperRef.clientHeight && this.popperHeight !== this.popperRef.clientHeight) {
          this.popperHeight = this.popperRef.clientHeight
        }
        poperTop += this.popperHeight
        if (poperTop >= bodyHeight) {
          placement = topPlacement
        }
      } else { // popper尚未挂载到dom，拿不到高度
        setTimeout(() => render(this.renderChildren(), this.container), 0)
      }
    }

    if (placement === 'top-bottom-start') {
      caclPlacement('bottom-start', 'top-start')
    } else if (placement === 'top-bottom') {
      caclPlacement('bottom', 'top')
    }

    return placement
  }

  renderChildren () {
    let {
      children,
      className,
      show,
      height,
      zIndex
    } = this.props
    const offset = this.getOffset()
    let width = offset.width
    let left = offset.left + 'px'
    let top = offset.top + 'px'

    return (
      <div
        className={classNames('hi-popper__container', {'hi-popper__container--hide': !show})}
        style={{left, top, zIndex}}
      >
        <div
          ref={node => {
            this.popperRef = node
          }}
          className={classNames(className, 'hi-popper__content', `hi-popper__content--${offset.placement}`, {'hi-popper__content--hide': this.popperHeight === 0})}
          style={{width, height}}
        >
          { children }
        </div>
      </div>
    )
  }

  getContainer () {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    // const child = React.Children.only(this.props.children)

    document.body.appendChild(container)

    this.container = container
  }

  render () {
    return null
  }
}
