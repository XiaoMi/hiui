import React, { Component } from 'react'
import Icon from '../icon'
import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'
const iconMap = {
  success: 'chenggong',
  error: 'shibai',
  warning: 'jinggao',
  info: 'tishi'
}
const iconColorMap = {
  success: '#1DA653',
  error: '#F44141',
  warning: '#E19D0C',
  info: '#4284F5'
}

export default class Notice extends Component {
  state = { open: false }
  componentDidMount() {
    this.setState({
      open: true
    })
    console.log(this.props.duration)
    if (this.props.duration !== null) {
      setTimeout(() => {
        this.setState({ open: false })
      }, this.props.duration || 3000)
    }
  }

  closeNotice = e => {
    if (e) {
      e.stopPropagation()
    }
    this.props.onClose(this.props.id)
  }

  render() {
    const { closable, children, prefix, type, isSingle } = this.props
    const { open } = this.state
    return (
      <CSSTransition
        in={open}
        timeout={0}
        classNames={`hi-${prefix}`}
        onExited={() => {
          setTimeout(() => this.closeNotice(), 300)
        }}
      >
        <div
          className={classNames(`hi-${prefix}--${type}`, `hi-${prefix}`, {
            [`hi-${prefix}--single`]: isSingle
          })}
        >
          {type && (
            <span style={{ marginRight: 12, fontSize: '16px', color: iconColorMap[type] }}>
              <i className={classNames('hi-icon', `icon-${iconMap[type]}`)} />
            </span>
          )}
          <div style={{ flex: 1 }}>{children}</div>
          {closable && (
            <Icon
              name="close"
              onClick={() => {
                this.setState({ open: false })
              }}
            />
          )}
        </div>
      </CSSTransition>
    )
  }
}
