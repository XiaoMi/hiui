import React, { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'
/**
 *
 *
 * @class Notification
 * @extends {Component}
 */
// info/error/success/warning
function handleNotificate (props) {
  props = props || {}
  const div = document.createElement('div')
  const noti = React.createElement(
    Notification,
    Object.assign({}, props, {
      removeContainDiv: () => {
        unmountComponentAtNode(div)
        document.body.removeChild(div)
      }
    })
  )
  render(noti, div)
  document.body.appendChild(div)
}

class Notification extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      remove: false,
      offsetTop: 20
    }
  }
  static propTypes = {
    banner: PropTypes.bool,
    showClose: PropTypes.bool,
    autoClose: PropTypes.bool,
    duration: PropTypes.number,
    positionFrom: PropTypes.string,
    positionAlign: PropTypes.string,
    type: PropTypes.string,
    onClose: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string,
    removeContainDiv: PropTypes.func
  }

  static defaultProps = {
    showClose: true,
    banner: false,
    prefixCls: 'hi-notification',
    autoClose: false,
    duration: 3000,
    positionFrom: 'top',
    positionAlign: 'right',
    type: 'info',
    title: 'title',
    message: 'message content'
  }
  componentWillMount () {
    const lastele = [].slice
      .call(document.querySelectorAll('.' + this.props.prefixCls + '.show'))
      .pop()
    if (!lastele) {
      return
    }
    const lastdis = lastele.offsetHeight - 0 + lastele.offsetTop + 10
    this.setState({ offsetTop: lastdis })
  }
  componentDidMount () {
    const { autoClose, duration } = this.props
    // 为了做渐变效果所以没直接在初始化 state 的时候设置为 true。。可惜好像并不好用
    this.setState({ show: true })
    // 开始计时
    if (autoClose) {
      setTimeout(() => {
        this.closeNotify()
      }, duration)
    }
  }
  closeNotify () {
    this.setState({ show: false })
    this.props.onClose && this.props.onClose()
    setTimeout(
      function () {
        const eletsArr = [].slice.call(
          document.querySelectorAll('.' + this.props.prefixCls + '.show')
        )
        // console.log(eletsArr)
        eletsArr.reduce(function (top, item, idx, arr) {
          item.style.top = `${top}px`
          return top + item.offsetHeight - 0 + 10
        }, 20)
      }.bind(this),
      0
    )
  }
  removeNotify () {
    if (!this.state.show) {
      this.setState({ remove: true })
      if (this.props.removeContainDiv) {
        this.props.removeContainDiv()
      }
    }
  }

  render () {
    // const {
    //   autoClose,
    //   duration,
    //   positionAlign,
    //   positionFrom,
    //   type,
    //   onClose,
    //   title,
    //   message
    // } = this.props
    const classnames = classNames(this.props.prefixCls, this.props.type, {
      show: this.state.show
    })

    let type = this.props.type

    switch (type) {
      case 'warning':
        type = 'info-circle-o'
        break
      case 'error':
        type = 'close-circle-o'
        break
      case 'success':
        type = 'check-circle-o'
        break
      default:
        type = 'info-circle-o'
    }

    return !this.state.remove ? (
      <div
        className={classnames}
        onTransitionEnd={this.removeNotify.bind(this)}
        style={{ top: this.state.offsetTop + 'px' }}
        ref={ele => {
          this.rootEle = ele
        }}
      >
        <div className='icon-contain'>
          <i className={`hi-icon icon-${type}`} />
        </div>
        <span className='title'>{this.props.title}</span>
        <span className='message'>{this.props.message}</span>
        {this.props.showClose && (
          <a className='close icon-img-delete' onClick={this.closeNotify.bind(this)}>
            <i className='hi-icon icon-close' />
          </a>
        )}
      </div>
    ) : null
  }
}

export default handleNotificate
