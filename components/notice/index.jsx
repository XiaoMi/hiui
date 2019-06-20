import React, { Component } from 'react'
import Icon from '../icon'
export default class Notice extends Component {
  componentDidMount () {
    setTimeout(() => {
      this.props.onClose()
    }, this.props.duration || 300)
  }

  closeNotice = e => {
    if (e) {
      e.stopPropagation()
    }
    this.props.onClose()
  }

  render () {
    const { closable, children } = this.props
    return (
      <div>
        <div>{children}</div>
        {closable && <Icon name='close' onClick={this.closeNotice} />}
      </div>
    )
  }
}
