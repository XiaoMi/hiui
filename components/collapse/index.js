import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'

const noop = () => {}
class Collapse extends Component {
  static propTypes = {
    accordion: PropTypes.bool, // 手风琴模式
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func,
    icon: PropTypes.string,
    type: PropTypes.string, //
    arrow: PropTypes.string
  }
  static defaultProps = {
    prefixCls: 'hi-collapse',
    accordion: false,
    arrow: 'left',
    type: 'default'
  }
  constructor (props) {
    super(props)
    this.state = {
      activeKey: Array.isArray(this.props.activeKey) ? this.props.activeKey : [this.props.activeKey]
    }
  }
  onClickPanel (key) {
    let activeKey = this.state.activeKey
    if (this.props.accordion) {
      activeKey = activeKey[0] === key ? [] : [key]
    } else {
      activeKey = [...activeKey]
      const index = activeKey.indexOf(key)
      const isActive = index > -1
      if (isActive) {
        activeKey.splice(index, 1)
      } else {
        activeKey.push(key)
      }
    }
    this.setActiveKey(activeKey)
  }
  setActiveKey (activeKey) {
    // if (!('activeKey' in this.props)) {
    this.setState({ activeKey })
    // }
    this.props.onChange(this.props.accordion ? activeKey[0] : activeKey)
  }

  renderPanels () {
    const activeKey = this.state.activeKey
    const { children, accordion, arrow } = this.props
    const newChildren = []
    Children.forEach(children, (child, index) => {
      if (!child) return
      const key = child.key || String(index)
      const { header, disabled } = child.props
      let isActive = false
      if (accordion) {
        isActive = activeKey[0] === key
      } else {
        isActive = activeKey.indexOf(key) > -1
      }
      const props = {
        key,
        header,
        disabled,
        isActive,
        arrow,
        children: child.props.children,
        onClickPanel: disabled ? noop : () => this.onClickPanel(key)
      }
      newChildren.push(React.cloneElement(child, props))
    })
    return newChildren
  }
  render () {
    const { prefixCls, type } = this.props
    let classnames = classNames(prefixCls, type && `${prefixCls}__${type}`)
    return (
      <div className={classnames}>
        {this.renderPanels()}
      </div>
    )
  }
}

class CollapsePanel extends Component {
  static propTypes = {
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    isActive: PropTypes.bool,
    arrow: PropTypes.string,
    onClickPanel: PropTypes.func
  }
  static defaultProps = {
    disabled: false
  }

  render () {
    const {
      key,
      arrow,
      header,
      disabled,
      isActive,
      children,
      onClickPanel
    } = this.props
    let classnames = classNames('collapse-item', { show: isActive, disabled })
    const collapseIcon = classNames('collapse-icon', 'hi-icon', 'icon-right')
    return (
      <div className={classnames}>
        <div className='head' onClick={() => onClickPanel(key)}>
          { arrow === 'left' && <i className={collapseIcon} /> }
          <div className='title'>
            {header}
          </div>
          { arrow === 'right' && <i className={collapseIcon} /> }
        </div>
        <div className='content'>{children}</div>
      </div>
    )
  }
}
Collapse.Panel = CollapsePanel

export default Collapse
