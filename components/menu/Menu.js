import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Title from './Title'
import Item from './Item'
import SubMenu from './SubMenu'
import './style/index'
class Menu extends Component {
  constructor (props) {
    super(props)
    const {
      activeId,
      collapsed
    } = this.props
    const activeIndex = this.getActiveIndex(activeId)
    let expandIndex = []
    this.clickOutsideHandel = this.clickOutside.bind(this)
    if (this.isNoMiniVertaicalMenu(collapsed)) { // 垂直非mini菜单默认打开激活项
      expandIndex = [activeIndex.split('-').slice(0, -1).join('-')]
    }
    this.state = {
      activeId: this.props.activeId,
      expandIndex,
      activeIndex,
      collapsed
    }
    this.clickInsideFlag = false // click在menu标识
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeId !== this.props.activeId) {
      const activeIndex = this.getActiveIndex(nextProps.activeId, nextProps.data)

      this.setState({
        activeId: nextProps.activeId,
        activeIndex
      })
    }

    if (nextProps.collapsed !== this.props.collapsed) {
      this.setState({
        collapsed: nextProps.collapsed
      })
    }
  }

  componentDidMount () {
    window.addEventListener('click', this.clickOutsideHandel)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.clickOutsideHandel)
  }

  clickOutside () {
    if (!this.clickInsideFlag && !this.isNoMiniVertaicalMenu()) {
      this.setState({
        expandIndex: []
      })
    }

    this.clickInsideFlag = false
  }

  clickInside () {
    this.clickInsideFlag = true
  }

  getExpandIndex (clickedIndex) {
    if (!clickedIndex) {
      return []
    }
    const {
      accordion
    } = this.props
    const {
      expandIndex
    } = this.state
    let _clickedIndex = clickedIndex
    let subInExpandIndex = false

    let _expandIndex = expandIndex.filter(item => { // 点击父菜单时，需要把已展开的子菜单过滤掉，因为父菜单关闭时所有子菜单也要关闭
      const flag = item.startsWith(_clickedIndex)
      if (flag) {
        subInExpandIndex = true
      }
      return !flag
    })
    subInExpandIndex && _expandIndex.push(_clickedIndex) // subInExpandIndex为true说明其有子菜单被展开，在点击需要关闭

    const index = _expandIndex.indexOf(clickedIndex)

    if (index > -1) { // 点击同一个submenu，如果已展开则关闭
      _clickedIndex = clickedIndex.split('-').slice(0, -1).join('-')
    }

    if (!accordion && this.isNoMiniVertaicalMenu()) { // 非手风琴模式只有在垂直非mini状态下才生效
      index > -1 ? _expandIndex.splice(index, 1, _clickedIndex) : _expandIndex.push(_clickedIndex)

      return _expandIndex
    } else {
      return _clickedIndex ? [_clickedIndex] : []
    }
  }

  isNoMiniVertaicalMenu (collapsed = this.state.collapsed) { // 垂直非mini菜单
    return this.props.placement === 'vertical' && !collapsed
  }

  getActiveMenus (menus, activeId, activeMenus = []) {
    let result
    for (let index in menus) {
      let _activeMenus = [...activeMenus]
      if (menus[index].children) {
        _activeMenus.push(index)
        result = this.getActiveMenus(menus[index].children, activeId, _activeMenus)
      } else if (menus[index].id === activeId) {
        _activeMenus.push(index)
        result = _activeMenus
      }
      if (result) {
        break
      }
    }
    if (result) {
      return result
    }
  }

  getActiveIndex (activeId, menu) {
    // 获取激活item对应的索引，以'-'拼接成字符串
    const { data } = this.props

    if (activeId === undefined || activeId === '') {
      return ''
    }
    const activeMenus = this.getActiveMenus(menu || data, activeId, [])
    return (activeMenus && activeMenus.join('-')) || ''
  }

  toggleMini () {
    const collapsed = !this.state.collapsed
    const expandIndex = collapsed ? [] : this.state.expandIndex

    setTimeout(() => {
      this.setState({
        collapsed,
        expandIndex
      }, () => {
        this.props.onCollapse && this.props.onCollapse(collapsed)
      })
    }, 0)
  }

  onClick (indexs, id, data) {
    const expandIndex = this.isNoMiniVertaicalMenu() ? this.state.expandIndex : this.getExpandIndex('') // 非mini垂直菜单选中时不需要收起子菜单
    const oldId = this.state.activeId

    this.setState({
      activeId: id,
      activeIndex: indexs,
      expandIndex
    }, () => {
      this.props.onClick(id, oldId, data)
    })
  }

  onClickSubMenu (index) {
    const expandIndex = this.getExpandIndex(index)

    this.clickInside()
    this.setState({
      expandIndex
    }, () => {
      index && this.props.onClickSubMenu && this.props.onClickSubMenu(index.split('-'))
    })
  }

  renderItem (data, index, props = {}) { // render menu item
    const {
      activeIndex
    } = this.state
    const mergeProps = Object.assign({
      onClick: this.onClick.bind(this),
      id: data.id,
      icon: data.icon,
      activeIndex,
      index: index,
      disabled: data.disabled,
      key: index,
      data
    }, props)

    return (
      <Item {...mergeProps}>
        {data.content}
      </Item>
    )
  }

  renderFatSubMenu (data, parentIndex) { // render胖菜单
    let groups = []

    data.forEach((dataItem, groupIndex) => {
      groups.push(
        <li className='hi-menu-fat' key={groupIndex}>
          <div className='hi-menu-fat__title hi-menu__title'>
            <Title icon={dataItem.icon} content={dataItem.content} />
          </div>
          {dataItem.children && <ul className='hi-menu-fat__content'>
            {
              dataItem.children.map((child, index) => {
                return this.renderItem(child, parentIndex + '-' + groupIndex + '-' + index, {level: 2})
              })
            }
          </ul>}
        </li>
      )
    })
    return groups
  }

  renderMenu (data, parentIndex = '') {
    const {showAllSubMenus, placement} = this.props
    const {
      activeIndex,
      expandIndex,
      collapsed
    } = this.state
    let items = []
    const renderMenu = showAllSubMenus ? this.renderFatSubMenu.bind(this) : this.renderMenu.bind(this)
    data.forEach((item, index) => {
      const indexStr = parentIndex !== '' ? parentIndex + '-' + index : '' + index
      const level = indexStr.split('-').length

      if (item.children) {
        items.push(
          <SubMenu
            key={index}
            onClick={this.onClickSubMenu.bind(this)}
            clickInside={this.clickInside.bind(this)}
            index={indexStr}
            level={level}
            fatMenu={showAllSubMenus}
            activeIndex={activeIndex}
            expandIndex={expandIndex}
            disabled={item.disabled}
            content={item.content}
            icon={item.icon}
            renderMenu={renderMenu}
            datas={item.children}
            mode={placement}
            mini={collapsed}
          />
        )
      } else {
        items.push(this.renderItem(item, indexStr, {level}))
      }
    })

    return items
  }

  render () {
    const {data, placement, showCollapse} = this.props
    const {collapsed} = this.state
    const cls = classNames('hi-menu', `hi-menu--${placement}`, {
      'hi-menu--mini': collapsed
    })
    const miniIcon = <i className={`hi-icon icon-${collapsed ? 'Expand' : 'Collapse'}`} />

    return (
      <div className={cls}>
        <ul className='hi-menu-items'>
          { this.renderMenu(data) }
        </ul>
        {
          placement === 'vertical' && showCollapse &&
          <div
            className='hi-menu--mini__toggle'
            onClick={this.toggleMini.bind(this)}
          >
            {miniIcon}
          </div>
        }
      </div>
    )
  }
}

Menu.defaultProps = {
  placement: 'vertical',
  onClick: () => {},
  activeId: '',
  collapsed: false,
  showCollapse: false,
  showAllSubMenus: false,
  accordion: true
}
Menu.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    disabled: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children: PropTypes.array
  })),
  activeId: PropTypes.string,
  placement: PropTypes.oneOf(['horizontal', 'vertical']),
  collapsed: PropTypes.bool, // 是否是mini模式，需要同时placement=vertical时才生效
  showCollapse: PropTypes.bool, // mini状态开关，需要同时placement=vertical时才生效
  showAllSubMenus: PropTypes.bool, // 胖菜单，需要同时placement=horizontal时才生效
  accordion: PropTypes.bool,
  onClick: PropTypes.func,
  onClickSubMenu: PropTypes.func,
  onCollapse: PropTypes.func
}
export default Menu
