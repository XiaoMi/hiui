import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon'

const noop = () => {}

class Tabs extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['desc', 'card', 'button']),
    placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxTabs: PropTypes.number,
    renderTabBar: PropTypes.func,
    onTabClick: PropTypes.func,
    editable: PropTypes.bool,
    onEdit: PropTypes.func
  }

  static defaultProps = {
    prefixCls: 'hi-tabs',
    type: 'card',
    placement: 'top',
    maxTabs: 5,
    editable: false,
    onTabClick: noop,
    onEdit: noop
  }

  deleteTabKey = null

  constructor (props) {
    super(props)
    let { children, activeKey } = props

    children = React.Children.toArray(children)

    this.state = {
      activeKey: activeKey || children[0].props.tabKey
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.defaultActiveKey !== nextProps.defaultActiveKey) {
      this.setState({
        activeKey: nextProps.defaultActiveKey
      })
    }
    if (this.props.children.length > nextProps.children.length && this.deleteTabKey && this.deleteTabKey === this.state.activeKey) { // 删除的是当前激活的tab，需重置激活tab
      this.setState({
        activeKey: nextProps.children[0].props.tabKey
      }, () => {
        this.deleteTabKey = null
      })
    }
  }

  handleClick (tab, e) {
    if (tab.props.disabled) {
      return false
    }

    this.setState(
      {
        activeKey: tab.props.tabKey
      },
      () => {
        const { onTabClick } = this.props

        onTabClick(tab, e)
      }
    )
  }

  addTab () {
    const {
      onEdit,
      editable,
      children
    } = this.props

    if (editable) {
      onEdit('add', (children.length + 1))
    }
  }

  deleteTab (e, tabKey, index) {
    e.stopPropagation()
    this.deleteTabKey = tabKey

    const {
      onEdit,
      editable
    } = this.props

    if (editable) {
      onEdit('delete', index, tabKey)
    }
  }

  renderTabContent (child) {
    const { tabKey } = child.props
    const { activeKey } = this.state

    return cloneElement(child, {
      show: tabKey === activeKey
    })
  }

  render () {
    const { activeKey } = this.state
    const { prefixCls, type, placement, editable, children } = this.props
    const tabsClasses = classNames(prefixCls, `${prefixCls}--${type}`, {
      [`${prefixCls}-${placement}`]: type === 'card'
    })

    return (
      <div className={tabsClasses}>
        <div className={`${prefixCls}__header`}>
          <div className={`${prefixCls}__nav`}>
            {React.Children.map(children, (item, index) => {
              const { tabName, tabKey, tabDesc, disabled, closable } = item.props

              const itemClasses = classNames(`${prefixCls}__item`, {
                [`${prefixCls}__item--active`]: tabKey === activeKey,
                [`${prefixCls}__item--disabled`]: disabled
              })

              return (
                <div
                  className={itemClasses}
                  key={`${prefixCls}__item-${index}`}
                  onClick={e => this.handleClick(item, e)}
                >
                  <span className={`${prefixCls}__item-name`}>{tabName}</span>
                  {
                    type === 'desc' &&
                    <span className={`${prefixCls}__item-desc`}>{tabDesc}</span>
                  }
                  {
                    editable && closable &&
                    <span className={`${prefixCls}__item-close`}>
                      <Icon onClick={e => this.deleteTab(e, tabKey, index)} name='close' />
                    </span>
                  }
                </div>
              )
            })}
          </div>
          {
            editable &&
            <div className={`${prefixCls}__add`}>
              <Icon onClick={this.addTab.bind(this)} name='plus' />
            </div>
          }
        </div>
        <div className={`${prefixCls}__content`}>
          {React.Children.map(children, item => {
            return this.renderTabContent(item)
          })}
        </div>
      </div>
    )
  }
}

export default Tabs
