import React from 'react'

class Ficon extends React.Component {
  render () {
    const {
      className,
      name,
      style
    } = this.props

    const classes = `hi-fa fa-${name} ${className || ''}`

    return (
      <i className={classes} style={{style}} />
    )
  }
}

export default Ficon
