import React, { Component } from 'react'
import Icon from '../icon'
import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'

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
    const { closable, children, prefix, type } = this.props
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
        <div className={classNames(`hi-${prefix}`, { [`hi-${prefix}--${type}`]: type })}>
          <div style={{ paddingRight: 14 }}>{children}</div>
          {closable && (
            <Icon
              className={`hi-${prefix}__closer`}
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
