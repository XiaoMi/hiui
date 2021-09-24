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
    const _style = {
      backgroundColor: color,
      marginTop: offset[1] || 0,
      marginRight: -(offset[0] || 0)
    }

    const badgeNode =
      type === 'dot' ? (
        <span className={`${prefixCls}-dot`} style={_style} />
      ) : (
        <span className={`${prefixCls}-value`} style={_style}>
          {typeof content === 'number' ? (content > max ? max + '+' : content) : content}
        </span>
      )

    return (
      <div className={prefixCls} style={style}>
        {this.props.children}
        {visible ? badgeNode : null}
      </div>
    )
  }
}

export default Badge
