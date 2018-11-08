import React, {Component} from 'react'
import classNames from 'classnames'
import './style/index'
const PropTypes = require('prop-types')

class Col extends Component {
  render () {
    let {
      children,
      span = '',
      style = {},
      offset = '',
      id,
      className,
      justify
    } = this.props
    const {gutter = false} = this.context
    let obj = {}
    obj['hi-grid-col-' + span] = span && true
    obj['hi-grid-offset-' + offset] = offset && true
    obj['hi-grid-col-common'] = true
    obj['hi-grid-col-gutter'] = gutter
    let colClass = classNames(obj)

    if (justify) {
      style = Object.assign({}, style, {
        display: 'flex',
        justifyContent: justify
      })
    }

    return (
      <div
        id={`${id || ''}`}
        className={`${colClass} ${className || ''}`}
        style={style}
      >
        {children}
      </div>
    )
  }
}
Col.contextTypes = {
  gutter: PropTypes.bool
}

class Row extends Component {
  getChildContext () {
    return {gutter: this.props.gutter}
  }

  render () {
    let {
      children,
      style = {},
      className,
      id,
      gutter,
      justify
    } = this.props

    let obj = {}
    obj['hi-grid-row'] = true
    obj['hi-grid-row-common'] = true
    obj['hi-grid-row-gutter'] = gutter
    let rowClass = classNames(obj)

    if (justify) {
      style = Object.assign({}, style, {
        justifyContent: justify
      })
    }

    return (
      <div
        id={`${id || ''}`}
        className={`${rowClass} ${className || ''}`}
        style={style}
      >
        {children}
      </div>
    )
  }
}
Row.childContextTypes = {
  gutter: PropTypes.bool
}

class Br extends Component {
  render () {
    let {height = '5px', style = {}} = this.props
    style.height = parseInt(height) + 'px'
    return (
      <div style={style} />
    )
  }
}
export default {Row, Col, Br}
