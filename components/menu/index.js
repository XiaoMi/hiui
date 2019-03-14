import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import HorizontalMenu from './HorizontalMenu'
import Item from './Item'
import SubMenu from './SubMenu'
import ItemGroup from './ItemGroup'
import './style/index'
class Menu extends Component {
  static defaultProps = {
    mode: 'vertical',
    onClick: () => {},
    activeId: ''
  }
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        children: PropTypes.array
      })
    ])),
    activeId: PropTypes.string,
    mode: PropTypes.oneOf(['horizontal', 'vertical']),
    onClick: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      activeId: this.props.activeId
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeId !== this.props.activeId) {
      this.setState({
        activeId: nextProps.activeId
      })
    }
  }

  getChildContext () {
    return {
      component: this
    }
  }

  onClick (id) {
    const oldId = this.state.activeId

    this.setState({
      activeId: id
    }, () => {
      this.props.onClick(id, oldId)
    })
  }

  render () {
    const {children, mode} = this.props
    const cls = classNames('hi-menu', `hi-menu-${mode}`)

    return (
      <div className={cls}>
        <HorizontalMenu >
          {children}
        </HorizontalMenu>
      </div>
    )
  }
}
Menu.childContextTypes = {
  component: PropTypes.any
}

Menu.Item = Item
Menu.SubMenu = SubMenu
Menu.ItemGroup = ItemGroup
export default Menu
