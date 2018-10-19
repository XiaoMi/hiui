import React from 'react'

class Icon extends React.Component {
  render () {
    const {
      className,
      name,
      style,
      ...rest
    } = this.props

    const classes = `hi-icon icon-${name} ${className || ''}`

    return (
      <i className={classes} style={style} {...rest} />
    )
  }
}

export default Icon
