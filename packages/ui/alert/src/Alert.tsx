import * as React from 'react';
import classNames from 'classnames'
import './style/index.scss'

class Alert extends React.Component< AlertProps, AlertState >  {
  timeoutId  = 0
  
  static defaultProps = {
    prefixCls: 'hi-alert',
    type: 'info',
    closeable: true,
    duration: null
  }

  constructor (props :AlertProps) {
    super(props)
    this.state = { visible: true }
  }

  componentDidMount () {
    const { duration } = this.props
    if (duration !== null) {
    this.timeoutId = window.setTimeout(() => {
        this.handleClose()
      }, duration)
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timeoutId)
  }

  handleClose = (): void => {
    const { onClose } = this.props
    this.setState({ visible: false })
    onClose && onClose()
  }

  render () {
    const { prefixCls, title, type, content, closeable } = this.props 
    const { visible } = this.state 
    const classnames = classNames(prefixCls, visible, type, {
      noTitle: !title
    })
    let typeIcon  = 'tishi'

    switch (type) {
      case 'warning':
        typeIcon = 'jinggao'
        break
      case 'error':
        typeIcon = 'shibai'
        break
      case 'success':
        typeIcon = 'chenggong'
        break
      default:
        typeIcon = 'tishi'
    }

    return (
      visible && (
        <div className={classnames}>
          <div className='hi-icon__title'>
            <i className={`hi-icon icon-${typeIcon}`} />
            {title && <div className='text-title'>{title}</div>}
          </div>
          {content && <div className="text-message">{content}</div>}
          {closeable && (
            <div className='close-btn icon-img-delete' onClick={this.handleClose}>
              <i className='hi-icon icon-close' />
            </div>
          )}
        </div>
      )
    )
  }
}

interface AlertProps {
    type ?: 'info' | 'error' |  'success' | 'warning';
    onClose ?: () => void;
    content ?: React.ReactNode;
    title ?: React.ReactNode;
    closeable ?: boolean;
    duration ?: number | null;
    prefixCls ?: string;
    theme ?: string;
}
interface AlertState {
    visible : boolean
}

export default Alert
