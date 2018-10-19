import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Tabs extends Component {
  static propTypes = {
    type: PropTypes.string,
    activeName: PropTypes.string,
    onTabClick: PropTypes.func
  }

  static defaultProps = {
    prefixCls: 'hi-tabs',
    type: 'card'
  }

  constructor (props) {
    super(props)
    let { children, activeTabKey, value } = props

    children = React.Children.toArray(children)

    this.state = {
      children,
      currentKey: value || activeTabKey || children[0].props.tabKey
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeTabKey !== this.state.activeTabKey) {
      this.setState({
        currentKey: nextProps.activeTabKey
      })
    }
    if (nextProps.value !== this.state.value) {
      this.setState({
        currentKey: nextProps.value
      })
    }
    if (nextProps.children !== this.state.children) {
      this.setState({
        children: React.Children.toArray(nextProps.children)
      })
    }
  }

  handleClick (tab, e) {
    if (tab.props.disabled) {
      return false
    }

    this.setState(
      {
        currentKey: tab.props.tabKey
      },
      () => {
        const { onTabClick } = this.props

        onTabClick && onTabClick(tab, e)
      }
    )
  }

  renderTabContent (child) {
    const { tabKey } = child.props
    const { currentKey } = this.state

    return cloneElement(child, {
      show: tabKey === currentKey
    })
  }

  render () {
    const { children, currentKey } = this.state
    const { prefixCls, type } = this.props
    const classes = classNames(`${prefixCls}`, {
      [`${prefixCls}-card`]: type === 'card'
    })

    return (
      <div className={classes}>
        <div className={`${prefixCls}-header`}>
          <div className={`${prefixCls}-nav`}>
            {React.Children.map(children, (item, index) => {
              const { tabName, tabKey, disabled } = item.props

              const classes = classNames(`${prefixCls}-item`, {
                'is-active': tabKey === currentKey,
                'is-disabled': disabled
              })

              return (
                <div
                  className={classes}
                  key={`${prefixCls}-item-${index}`}
                  onClick={e => this.handleClick(item, e)}
                >
                  <a href='javascript:;'>{tabName}</a>
                </div>
              )
            })}
          </div>
        </div>
        <div className={`${prefixCls}-content`}>
          {React.Children.map(children, item => {
            return this.renderTabContent(item)
          })}
        </div>
      </div>
    )
  }
}

export default Tabs
