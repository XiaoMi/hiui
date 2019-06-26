import React, { Component } from 'react'
import Icon from '../icon'
export default class Notice extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.onClose(this.props.id)
    }, this.props.duration || 3000)
  }

  closeNotice = e => {
    if (e) {
      e.stopPropagation()
    }
    this.props.onClose(this.props.id)
  }

  render() {
    const { closable, children, prefix } = this.props
    return (
      <div className={`hi-${prefix}`}>
        <div>{children}</div>
        {closable && <Icon name="close" onClick={this.closeNotice} />}
      </div>
    )
  }
}
