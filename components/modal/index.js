import React, { Component } from 'react'
import {createPortal} from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from '../button'
import Icon from '../icon'
import './style/index'
import Provider from '../context'

class Modal extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    size: PropTypes.oneOf(['large', 'normal', 'small']),
    show: PropTypes.bool,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    backDrop: PropTypes.bool,
    confirmType: PropTypes.string,
    cancelType: PropTypes.string,
    closeBtn: PropTypes.bool
  }

  static defaultProps = {
    title: '',
    adaptive: false,
    backDrop: true,
    show: false,
    closeBtn: true,
    destory: false,
    size: 'normal'
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.node = document.createElement('div')
    document.body.appendChild(this.node)
  }
  static getDerivedStateFromProps (props, state) {
    // 屏蔽滚动条
    if (props.show) {
      document.body.style.setProperty('overflow', 'hidden')
    } else {
      document.body.style.removeProperty('overflow')
    }
    return null
  }
  componentWillUnMount () {
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
    const {
      localeDatas
    } = this.props
    if (this.props[key]) {
      return this.props[key]
    } else {
      return localeDatas.modal[key]
    }
  }
  renderFooter () {
    const {footers} = this.props
    const cancelText = this.localeDatasProps('cancelText')
    const confirmText = this.localeDatasProps('confirmText')
    if (footers) {
      return footers
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
    const {width, title, children, backDrop, closeBtn, footers, show, size, className} = this.props
    let style = width ? {width} : {}
    let classnames = classNames('hi-modal', show ? '' : 'hi-modal--hide', className)
    return createPortal(
      <div className={classnames} >
        <div className='hi-modal__mask' onClick={() => {
          backDrop && this.handleClose.apply(this)
        }} />
        <div className={classNames('hi-modal__dialog', size ? `hi-modal__dialog--${size}` : '')} style={style}>
          {
            (title || closeBtn) && <div className='hi-modal__header'>
              <h3 className='hi-modal__title'>{title}</h3>
              {
                closeBtn &&
                <div className='hi-modal__close' onClick={this.handleClose.bind(this)}>
                  <Icon name='close' />
                </div>
              }
            </div>
          }
          <div className='hi-modal__content'>
            {children}
          </div>
          {
            (!footers || footers.length > 0) && <div className='hi-modal__footer'>
              {this.renderFooter()}
            </div>
          }
        </div>
      </div>,
      this.node
    )
  }
}

export default Provider(Modal)
