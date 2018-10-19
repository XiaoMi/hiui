import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TabPane extends Component {
  static defaultProps = {
    prefixCls: 'hi-tabs-pane',
    disabled: false
  }

  static propTypes = {
    tabName: PropTypes.string,
    tabKey: PropTypes.string,
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
