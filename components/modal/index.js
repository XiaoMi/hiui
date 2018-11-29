import React, { Component } from 'react'
import {createPortal} from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from '../button'
import './style/index'

class Modal extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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
    prefixCls: 'hi-modal',
    adaptive: false,
    confirmText: '确定',
    cancelText: '取消',
    backDrop: true,
    show: false,
    confirmType: 'primary',
    cancelType: 'primary',
    closeBtn: true,
    destory: false
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
  renderFooter () {
    const {cancelText, confirmText, cancelType, confirmType, footers} = this.props
    if (footers) {
      return footers
    } else {
      return [
        <Button type={cancelType} appearance='line' key={0} onClick={this.handleClose.bind(this)}>
          {cancelText}
        </Button>,
        <Button type={confirmType} key={1} onClick={this.handleConfirm.bind(this)}>
          {confirmText}
        </Button>
      ]
    }
  }
  render () {
    const {width, title, children, backDrop, closeBtn, footers} = this.props
    const {show} = this.props
    let style = width ? {width} : {}
    let classnames = classNames('hi-modal', show ? '' : 'hide')
    return createPortal(
      <div
        className={classnames}
      >
        <div className='modal-shade' onClick={() => {
          backDrop && this.handleClose.apply(this)
        }} />
        <div className='modal-dialog' style={style}>
          {
            (title || closeBtn) && <div className='title-container'>
              <span className='title'>{title}</span>
              {closeBtn && <i
                style={{margin: '0 10px'}}
                className='hi-icon icon-close'
                onClick={this.handleClose.bind(this)}
              />}
            </div>
          }
          <div className='content'>
            {children}
          </div>
          {
            (!footers || footers.length > 0) && <div className='control'>
              {this.renderFooter()}
            </div>
          }
        </div>
      </div>,
      this.node
    )
  }
}

export default Modal
