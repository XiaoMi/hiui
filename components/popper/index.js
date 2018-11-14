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
    className: PropTypes.string,
    show: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    topGap: PropTypes.number,
    leftGap: PropTypes.number
  }

  static defaultProps = {
    show: false,
    topGap: 2,
    leftGap: 0
  }

  componentDidUpdate () {
    render(this.renderChildren(), this.container)
  }

  componentDidMount () {
    this.getContainer()
  }

  componentWillUnmount () {
    document.body.removeChild(this.container)
  }

  getOffset (ele) {
    let offset = {
      left: 0,
      top: 0
    }
    while (ele && ele !== document.body) {
      offset.top += ele.offsetTop - ele.scrollTop
      offset.left += ele.offsetLeft - ele.scrollLeft
      ele = ele.offsetParent
    }

    return offset
  }

  renderChildren () {
    let {
      children,
      className,
      show,
      attachEle,
      topGap,
      leftGap,
      width
    } = this.props
    width = width !== undefined ? width : attachEle.offsetWidth
    const height = attachEle.offsetHeight
    const offset = this.getOffset(attachEle)
    const left = offset.left + leftGap + 'px'
    const top = offset.top + topGap + height + 'px'
    window.attachEle = attachEle

    return (
      <div className={classNames(className, 'hi-popper__container', {'hi-popper__container--hide': !show})} style={{left, top, width}}>
        { children }
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
