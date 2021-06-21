import React, { Component } from 'react'
import classNames from 'classnames'
import Icon from '../icon'
import './style/index'
class Alert extends Component {
  constructor (props) {
    super(props)
    this.state = { visible: true }
  }
  componentDidMount () {
    if (this.props.duration !== null) {
      window.setTimeout(() => {
        this.handleClose()
      }, this.props.duration)
    }
  }
  handleClose = () => {
    this.setState({ visible: false })
    this.props.onClose && this.props.onClose()
  }
  render () {
    const { prefixCls, type, theme, title, content, closeable } = this.props
    let classnames = classNames(prefixCls, `${prefixCls}--${type}`, `theme__${theme}`)
    let _type
    switch (type) {
      case 'warning':
        _type = 'exclamation-circle'
        break
      case 'error':
        _type = 'close-circle'
        break
      case 'success':
        _type = 'check-circle'
        break
      default:
        _type = 'info-circle'
    }

    return (
      this.state.visible && (
        <div className={classnames}>
          <div className='hi-alert__title'>
            <Icon name={_type} filled />
            {title}
          </div>
          {content && <div className='hi-alert__content'>{content}</div>}
          {closeable && <Icon name='close' className='hi-alert__close-btn' onClick={this.handleClose} />}
        </div>
      )
    )
  }
}

Alert.defaultProps = {
  prefixCls: 'hi-alert',
  type: 'info',
  closeable: true,
  duration: null
}

export default Alert
