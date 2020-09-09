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

  render () {
    const { content, prefixCls, max, type, visible, style } = this.props
    const badage =
      type === 'dot' ? (
        <span className={`${prefixCls}-dot`} />
      ) : (
        <span className={`${prefixCls}-value`}>
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
