import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'

export default class Popper extends Component {
  container = undefined

  static propTypes = {
    // attachEle: PropTypes.oneOfType([
    //   PropTypes.node
    // ]).isRequired,
    width: PropTypes.string,
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

  componentDidUpdate () {
    render(this.renderChildren(), this.container)
  }

  componentDidMount () {
    this.getContainer()
    setTimeout(() => render(this.renderChildren(true), this.container), 0)
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
    let top = rect.y + (document.documentElement.scrollTop || document.body.scrollTop)
    let left = rect.x + (document.documentElement.scrollLeft || document.body.scrollLeft)
    width = width === undefined ? rect.width : width

    if (placement === 'top-bottom-start') {
      console.log('------------getOffset', rect, attachEle.offsetBottom, this.popperRef.clientHeight)
    }

    switch (placement) {
      case 'bottom':
        top = top + topGap + rect.height
        left = left + rect.width / 2
        break
      case 'bottom-start':
        top = top + topGap + rect.height
        break

      case 'top':
        top = top - topGap
        left = left + rect.width / 2
        break
      case 'top-start':
        top = top - topGap
        break

      case 'left':
        top = top + rect.height / 2
        left = left + leftGap
        break

      case 'right':
        top = top + rect.height / 2
        left = left + rect.width + leftGap
        break
    }

    return {
      width,
      top,
      left
    }
  }

  renderChildren (init = false) {
    let {
      children,
      className,
      show,
      zIndex,
      placement
    } = this.props
    let width = 'auto'
    let left = '0px'
    let top = '0px'
    console.log('-----------init', init)
    if (!init) {
      const offset = this.getOffset()
      width = 0
      left = offset.left + 'px'
      top = offset.top + 'px'
    }

    return (
      <div
        className={classNames('hi-popper__container', {'hi-popper__container--hide': !show})}
        style={{left, top, zIndex}}
      >
        <div
          ref={node => {
            this.popperRef = node
          }}
          className={classNames(className, 'hi-popper__content', `hi-popper__content--${placement}`)}
          style={{width}}
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
