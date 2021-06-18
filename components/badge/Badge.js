import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style/index'

class Badge extends Component {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOf(['bubble', 'dot']),
    max: PropTypes.number,
    visible: PropTypes.bool,
    style: PropTypes.object
  }

  static defaultProps = {
    prefixCls: 'hi-badge',
    style: {},
    content: '',
    type: 'bubble',
    max: 99,
    visible: true
  }

  render() {
    const { content, prefixCls, max, type, visible, style, color, offset = [] } = this.props
    const [left, top] = offset
    const badage =
      type === 'dot' ? (
        <span className={`${prefixCls}-dot`} style={{ backgroundColor: color, left, top }} />
      ) : (
        <span className={`${prefixCls}-value`} style={{ backgroundColor: color, left, top }}>
          {typeof content === 'number' ? (content > max ? max + '+' : content) : content}
        </span>
      )
    return (
      <div className={prefixCls} style={style}>
        {this.props.children}
        {visible && badage}
      </div>
    )
  }
}

export default Badge
