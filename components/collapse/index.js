import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import Panel from './Panel'
import './style/index'

const noop = () => {}
class Collapse extends Component {
  static propTypes = {
    accordion: PropTypes.bool, // 手风琴模式
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    defaultActiveId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func,
    icon: PropTypes.string,
    type: PropTypes.string, // TODO:废弃
    arrow: PropTypes.oneOf(['left', 'right']), // TODO:废弃，使用 arrowPlacement
    arrowPlacement: PropTypes.oneOf(['left', 'right']),
    showArrow: PropTypes.bool,
    extra: PropTypes.node
  }

  static defaultProps = {
    prefixCls: 'hi-collapse',
    accordion: false,
    arrow: 'left',
    arrowPlacement: 'left',
    type: 'default',
    showArrow: true
  }

  constructor(props) {
    super(props)
    const { activeId, activeKey, defaultActiveId } = this.props
    const _activeId = activeId || activeKey || defaultActiveId || []
    this.state = {
      activeId: Array.isArray(_activeId) ? _activeId : [_activeId]
    }
    this.panelContainer = React.createRef(null)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.activeId !== prevState.activeId) && nextProps.activeId !== undefined) {
      return {
        activeId: nextProps.activeId
      }
    }
    return null
  }

  onClickPanel(key) {
    let activeKey = this.state.activeId
    if (this.props.accordion) {
      activeKey = activeKey[0] === key ? [] : [key]
    } else {
      activeKey = activeKey !== 'undefined' ? [...activeKey] : []
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

  setActiveKey(activeKey) {
    const { onChange, accordion } = this.props
    this.setState({ activeId: activeKey })
    onChange && onChange(accordion ? activeKey[0] : activeKey)
  }

  renderPanels() {
    const activeKey = this.state.activeId
    const { children, accordion, arrow, arrowPlacement, showArrow } = this.props

    const newChildren = []
    Children.forEach(children, (child, index) => {
      if (!child) return
      const key = child.props.id || child.key || String(index)
      const { header, disabled, title, extra } = child.props

      const isActive = accordion ? activeKey[0] === key : activeKey.includes(key)
      const props = {
        key,
        header: title || header,
        disabled,
        isActive,
        arrow: arrowPlacement !== 'left' ? arrowPlacement : arrow,
        showArrow,
        children: child.props.children,
        onClickPanel: disabled ? noop : () => this.onClickPanel(key),
        panels: children,
        panelContainer: this.panelContainer,
        idx: index,
        extra
      }
      newChildren.push(React.cloneElement(child, props))
    })
    return newChildren
  }

  render() {
    const { prefixCls, type } = this.props
    const classnames = classNames(prefixCls, type && `${prefixCls}__${type}`)
    return (
      <div className={classnames} ref={this.panelContainer}>
        {this.renderPanels()}
      </div>
    )
  }
}

Collapse.Panel = Panel

export default Collapse
