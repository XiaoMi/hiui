import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from '../button'
import Icon from '../icon'
import './style/index'
import Provider from '../context'

class Modal extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    size: PropTypes.oneOf(['large', 'default', 'small']),
    show: PropTypes.bool, // TODO: 废弃，使用 visible
    visible: PropTypes.bool,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    backDrop: PropTypes.bool, // TODO: 废弃，使用 maskCloseable
    maskCloseable: PropTypes.bool,
    confirmType: PropTypes.string,
    cancelType: PropTypes.string,
    closeBtn: PropTypes.bool, // TODO: 废弃，使用 maskCloseable
    closabble: PropTypes.bool
  }

  static defaultProps = {
    title: '',
    adaptive: false,
    backDrop: true,
    maskCloseable: true,
    show: false,
    visible: false,
    closeBtn: true,
    closeable: true,
    destory: false,
    size: 'default'
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.node = document.createElement('div')
    document.body.appendChild(this.node)
  }
  static getDerivedStateFromProps (props, state) {
    // 屏蔽滚动条
    if (props.show || props.visible) {
      document.body.style.setProperty('overflow', 'hidden')
    } else {
      document.body.style.removeProperty('overflow')
    }
    return null
  }
  componentWillUnmount () {
    this._unblock()
  }
  _unblock () {
    this.props.destory && document.body.removeChild(this.node)
    document.body.style.removeProperty('overflow')
  }
  handleConfirm () {
    if (this.props.onConfirm) {
      this.props.onConfirm()
    }
    this._unblock()
  }
  handleClose () {
    if (this.props.onCancel) {
      this.props.onCancel()
    }
    this._unblock()
  }
  localeDatasProps (key) {
    const { localeDatas } = this.props
    if (this.props[key]) {
      return this.props[key]
    } else {
      return localeDatas.modal[key]
    }
  }
  renderFooter () {
    const { footers, footer } = this.props
    const cancelText = this.localeDatasProps('cancelText')
    const confirmText = this.localeDatasProps('confirmText')
    if (footers || footer) {
      return footers || footer
    } else {
      return [
        <Button type='default' key={0} onClick={this.handleClose.bind(this)}>
          {cancelText}
        </Button>,
        <Button type='primary' key={1} onClick={this.handleConfirm.bind(this)}>
          {confirmText}
        </Button>
      ]
    }
  }
  render () {
    const {
      width,
      style = {},
      title,
      children,
      backDrop,
      maskCloseable,
      closeBtn,
      closeable,
      footers, // TODO: 废弃，使用 footer 代替
      footer,
      show,
      visible,
      size,
      className
    } = this.props
    let _style = width ? Object.assign({}, { width }, { ...style }) : style
    let classnames = classNames('hi-modal', show || visible ? '' : 'hi-modal--hide', className)
    return createPortal(
      <div className={classnames}>
        <div
          className='hi-modal__mask'
          onClick={() => {
            ((backDrop && maskCloseable !== false) || (maskCloseable && backDrop !== false)) &&
              this.handleClose.apply(this)
          }}
        />
        <div
          className={classNames(
            'hi-modal__dialog',
            size ? `hi-modal__dialog--${size === 'default' ? 'normal' : size}` : ''
          )}
          style={_style}
        >
          {(title || (closeBtn && closeable !== false) || (closeable && closeBtn !== false)) && (
            <div className='hi-modal__header'>
              <h3 className='hi-modal__title'>{title}</h3>
              {((closeBtn && closeable !== false) || (closeable && closeBtn !== false)) && (
                <div className='hi-modal__close' onClick={this.handleClose.bind(this)}>
                  <Icon name='close' />
                </div>
              )}
            </div>
          )}
          <div className='hi-modal__content'>{children}</div>
          {(((!footers || footers.length > 0) && footer !== null) || footer) && (
            <div className='hi-modal__footer'>{this.renderFooter()}</div>
          )}
        </div>
      </div>,
      this.node
    )
  }
}

export default Provider(Modal)
