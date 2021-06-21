import React, { Component } from 'react'
import classNames from 'classnames'
import './style/index'
const PropTypes = require('prop-types')

class Col extends Component {
  render() {
    let { children, span = '', style = {}, offset = '', id, className, justify, ...others } = this.props
    const { gutter = false } = this.context
    const obj = {}
    obj['hi-grid__col-' + span] = span && true
    obj['hi-grid__offset-' + offset] = offset && true
    obj['hi-grid__col--gutter'] = gutter
    const colClass = classNames(obj)

    if (justify) {
      style = Object.assign({}, style, {
        display: 'flex',
        justifyContent: justify
      })
    }

    return (
      <div {...others} id={`${id || ''}`} className={`${colClass} ${className || ''}`} style={style}>
        {children}
      </div>
    )
  }
}
Col.contextTypes = {
  gutter: PropTypes.bool
}

class Row extends Component {
  getChildContext() {
    return { gutter: this.props.gutter }
  }

  render() {
    let { children, style = {}, className, id, gutter, justify, ...others } = this.props

    const obj = {}
    obj['hi-grid__row'] = true
    obj['hi-grid__row--gutter'] = gutter
    const rowClass = classNames(obj)

    if (justify) {
      style = Object.assign({}, style, {
        justifyContent: justify
      })
    }

    return (
      <div {...others} id={`${id || ''}`} className={`${rowClass} ${className || ''}`} style={style}>
        {children}
      </div>
    )
  }
}
Row.childContextTypes = {
  gutter: PropTypes.bool
}

class Br extends Component {
  render() {
    const { height = '4px', style = {} } = this.props
    style.height = parseInt(height) + 'px'
    return <div style={style} />
  }
}
export default { Row, Col, Br }
