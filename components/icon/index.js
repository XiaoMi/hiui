import React from 'react'
import classNames from 'classnames'
import './style/index'

class Icon extends React.Component {
  render () {
    const {className, name, style, ...rest} = this.props

    const iconCls = classNames(`hi-icon`, `icon-${name}`, className)

    return <i className={iconCls} style={style} {...rest} />
  }
}

export default Icon
