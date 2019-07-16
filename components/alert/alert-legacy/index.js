import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'

class Alert extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['info', 'error', 'success', 'warning']),
    onCancel: PropTypes.func, // 废气，用 onClose 代替
    onClose: PropTypes.func,
    size: PropTypes.oneOf(['small', 'middle', 'large']),
    content: PropTypes.string, // 废弃，用 message 代替
    message: PropTypes.string,
    title: PropTypes.string,
    closeable: PropTypes.bool,
    autoClose: PropTypes.bool,
    autoCloseTime: PropTypes.number
  }
  static defaultProps = {
    prefixCls: 'hi-alert-legacy',
    type: 'info',
    size: 'middle',
    closeable: true,
    autoClose: false,
    autoCloseTime: 3000
  }
  componentDidMount () {
    if (!this.props.closeable && this.props.autoClose) {
      window.setTimeout(() => {
        this.handleClose()
      }, this.props.autoCloseTime)
    }
  }
  constructor (props) {
    super(props)
    this.state = { show: true }
  }
  handleClose () {
    this.setState({ show: false })
    this.props.onClose && this.props.onClose()
    this.props.onCancel && this.props.onCancel()
  }
  render () {
    let classnames = classNames(
      this.props.prefixCls,
      this.state.show,
      this.props.type,
      this.props.size,
      {
        noTitle: !this.props.title
      }
    )

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

    return this.state.show ? (
      <div className={classnames}>
        <div className='icon-contain'>
          <i className={`hi-icon icon-${type}`} />
        </div>
        <div className='text-contain'>
          {this.props.title && <div className='text-title'>{this.props.title}</div>}
          <div className='text-message'>
            {this.props.message || this.props.content}
            {React.Children.map(this.props.children, item => item)}
          </div>
        </div>
        {this.props.closeable ? (
          <div className='close-btn icon-img-delete' onClick={this.handleClose.bind(this)}>
            <i className='hi-icon icon-close' />
          </div>
        ) : null}
      </div>
    ) : null
  }
}
export default Alert
