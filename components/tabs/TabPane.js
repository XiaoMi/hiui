import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TabPane extends Component {
  static defaultProps = {
    prefixCls: 'hi-tabs-pane',
    disabled: false,
    closable: true
  }

  static propTypes = {
    tabTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    tabDesc: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    tabId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    closable: PropTypes.bool,
    disabled: PropTypes.bool
  }

  render () {
    const { prefixCls, children, show } = this.props
    const style = show ? {} : { display: 'none' }

    return (
      <div className={`${prefixCls}`} style={style}>
        {children}
      </div>
    )
  }
}

export default TabPane
