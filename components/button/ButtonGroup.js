import React, { Component } from 'react'
import classNames from 'classnames'

class ButtonGroup extends Component {
  static defaultProps = {
    prefixCls: 'hi-btn-group'
  }

  render () {
    const {
      prefixCls,
      style,
      className
    } = this.props
    const classes = classNames(`${prefixCls}`, className)
    return <div className={classes} style={style}>{this.props.children}</div>
  }
}

export default ButtonGroup
