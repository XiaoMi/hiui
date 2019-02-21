import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon'
import ItemDropdown from './ItemDropdown'

const noop = () => {}

class Tabs extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['desc', 'card', 'button']),
    placement: PropTypes.oneOf(['top', 'left']),
    defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showTabsNum: PropTypes.number,
    renderTabBar: PropTypes.func,
    onTabClick: PropTypes.func,
    editable: PropTypes.bool,
    onEdit: PropTypes.func
  }

  static defaultProps = {
    prefixCls: 'hi-tabs',
    type: 'card',
    placement: 'top',
    showTabsNum: 6,
    editable: false,
    onTabClick: noop,
    onEdit: noop
  }

  deleteTabKey = null

  constructor (props) {
    super(props)

    const { defaultActiveKey } = props
    const {
      showTabItems,
      hiddenTabItems
    } = this.getTabItems(this.props)

    this.state = {
      activeKey: defaultActiveKey || showTabItems[0].tabKey,
      showTabItems,
      hiddenTabItems
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      showTabItems,
      hiddenTabItems
    } = this.getTabItems(nextProps)
    this.setState({
      showTabItems,
      hiddenTabItems
    })

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

  getTabItems (props) {
    const {
      children,
      type,
      placement,
      showTabsNum,
      editable
    } = props
    const showTabItems = []
    const hiddenTabItems = []

    React.Children.map(children, (child, index) => {
      const { tabName, tabKey, tabDesc, disabled, closable } = child.props
      const item = { tabName, tabKey, tabDesc, disabled, closable }

      if (!editable && type === 'card' && placement === 'top' && showTabItems.length >= showTabsNum) { // 卡片式标签超过showTabsNum时，其余标签的隐藏
        hiddenTabItems.push(item)
      } else {
        showTabItems.push(item)
      }
    })
    return {showTabItems, hiddenTabItems}
  }

  handleClick (tab, e) {
    if (tab.disabled) {
      return false
    }

    this.setState(
      {
        activeKey: tab.tabKey
      },
      () => {
        const { onTabClick } = this.props

        onTabClick(tab.tabKey, e)
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

  checkEditable () {
    const {
      editable,
      type,
      placement
    } = this.props

    return editable && type === 'card' && placement === 'top'
  }

  renderTabContent (child) {
    const { tabKey } = child.props
    const { activeKey } = this.state

    return cloneElement(child, {
      show: tabKey === activeKey
    })
  }

  render () {
    const { activeKey, showTabItems, hiddenTabItems } = this.state
    const { prefixCls, type, placement, children } = this.props
    const editable = this.checkEditable()
    const tabsClasses = classNames(prefixCls, `${prefixCls}--${type}`, {
      [`${prefixCls}--${placement}`]: type === 'card',
      [`${prefixCls}--editable`]: editable
    })
    let activeTabInHiddenItems = true

    return (
      <div className={tabsClasses}>
        <div className={`${prefixCls}__header`}>
          <div className={`${prefixCls}__nav`}>
            {showTabItems.map((item, index) => {
              const { tabName, tabKey, tabDesc, disabled, closable } = item
              const itemClasses = classNames(`${prefixCls}__item`, {
                [`${prefixCls}__item--active`]: tabKey === activeKey,
                [`${prefixCls}__item--disabled`]: disabled
              })

              activeTabInHiddenItems = activeTabInHiddenItems && tabKey !== activeKey

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
            {
              hiddenTabItems.length > 0 &&
              <div className={classNames(`${prefixCls}__item`, {
                [`${prefixCls}__item--active`]: activeTabInHiddenItems
              })}
              >
                <ItemDropdown
                  active={activeTabInHiddenItems}
                  items={hiddenTabItems}
                  onChoose={(item, e) => {
                    console.log(item)
                    this.handleClick(item, e)
                  }}
                />
              </div>
            }
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
