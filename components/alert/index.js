import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'

class Alert extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['info', 'error', 'success', 'warning']),
    onClose: PropTypes.func,
    content: PropTypes.string,
    title: PropTypes.string,
    closeable: PropTypes.bool,
    duration: PropTypes.number
  }
  static defaultProps = {
    prefixCls: 'hi-alert',
    type: 'info',
    closeable: true,
    duration: null
  }
  componentDidMount() {
    if (this.props.duration !== null) {
      window.setTimeout(() => {
        this.handleClose()
      }, this.props.duration)
    }
  }
  constructor(props) {
    super(props)
    this.state = { visible: true }
  }
  handleClose() {
    this.setState({ visible: false })
    this.props.onClose && this.props.onClose()
  }
  render() {
    let classnames = classNames(this.props.prefixCls, this.state.visible, this.props.type, {
      noTitle: !this.props.title
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

    return (
      this.state.visible && (
        <div className={classnames}>
          <div className="hi-icon__title">
            <i className={`hi-icon icon-${type}`} />
            {this.props.title && <div className="text-title">{this.props.title}</div>}
          </div>
          {this.props.content && <div className="text-message">{this.props.content}</div>}
          {this.props.closeable && (
            <div className="close-btn icon-img-delete" onClick={this.handleClose.bind(this)}>
              <i className="hi-icon icon-close" />
            </div>
          )}
        </div>
      )
    )
  }
}
export default Alert
