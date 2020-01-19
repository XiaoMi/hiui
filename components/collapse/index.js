import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'

const noop = () => {}
class Collapse extends Component {
  static propTypes = {
    accordion: PropTypes.bool, // 手风琴模式
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange: PropTypes.func,
    icon: PropTypes.string,
    type: PropTypes.string, // TODO:废弃
    arrow: PropTypes.oneOf(['left', 'right']), // TODO:废弃，使用 arrowPlacement
    arrowPlacement: PropTypes.oneOf(['left', 'right']),
    showArrow: PropTypes.bool
  }
  static defaultProps = {
    prefixCls: 'hi-collapse',
    accordion: false,
    arrow: 'left',
    arrowPlacement: 'left',
    type: 'default',
    showArrow: true
  }
  constructor (props) {
    super(props)
    const { activeId, activeKey } = this.props
    const _activeId = activeId || activeKey
    this.state = {
      activeId: Array.isArray(_activeId) ? _activeId : [_activeId]
    }
  }
  onClickPanel (key) {
    let activeKey = this.state.activeId
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
    this.setState({ activeId: activeKey })
    this.props.onChange(this.props.accordion ? activeKey[0] : activeKey)
  }

  renderPanels () {
    const activeKey = this.state.activeId
    const { children, accordion, arrow, arrowPlacement, showArrow } = this.props

    const newChildren = []
    Children.forEach(children, (child, index) => {
      if (!child) return
      const key = child.props.id || child.key || String(index)
      const { header, disabled, title } = child.props
      let isActive = accordion ? activeKey[0] === key : activeKey.includes(key)
      const props = {
        key,
        header: title || header,
        disabled,
        isActive,
        arrow: arrowPlacement !== 'left' ? arrowPlacement : arrow,
        showArrow,
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
    return <div className={classnames}>{this.renderPanels()}</div>
  }
}

class CollapsePanel extends Component {
  static propTypes = {
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    isActive: PropTypes.bool,
    arrow: PropTypes.string,
    showArrow: PropTypes.bool,
    onClickPanel: PropTypes.func
  }
  static defaultProps = {
    disabled: false
  }

  render () {
    const { key, arrow, header, disabled, isActive, children, onClickPanel, showArrow } = this.props
    let classnames = classNames('collapse-item', {
      'collapse-item--show': isActive,
      'collapse-item--disabled': disabled
    })
    const collapseIcon = classNames('collapse-item__icon', 'hi-icon', 'icon-down')
    return (
      <div className={classnames}>
        <div className='collapse-item__head' onClick={() => onClickPanel(key)}>
          {showArrow && arrow === 'left' && <i className={collapseIcon} />}
          <div className='collapse-item__title'>{header}</div>
          {showArrow && arrow === 'right' && <i className={collapseIcon} />}
        </div>
        <div className='collapse-item__content'>{children}</div>
      </div>
    )
  }
}
Collapse.Panel = CollapsePanel

export default Collapse
