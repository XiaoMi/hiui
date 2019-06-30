import React, { Component } from 'react'
import Icon from '../icon'
import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'
export default class Notice extends Component {
  state = { open: false };
  componentDidMount () {
    this.setState({
      open: true
    })
    setTimeout(() => {
      this.setState({ open: false })
    }, this.props.duration || 3000)
  }

  closeNotice = e => {
    if (e) {
      e.stopPropagation()
    }
    this.props.onClose(this.props.id)
  };

  render () {
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
        <div className={classNames(`hi-${prefix}--${type}`, `hi-${prefix}`)}>
          {type && (
            <span style={{ marginRight: 12 }}>
              <Icon name='info-circle-o' />
            </span>
          )}
          <div style={{ flex: 1 }}>{children}</div>
          {closable && <Icon name='close' onClick={this.closeNotice} />}
        </div>
      </CSSTransition>
    )
  }
}
