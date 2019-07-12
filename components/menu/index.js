import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon'
import Title from './Title'
import Item from './Item'
import SubMenu from './SubMenu'
import './style/index'
class Menu extends Component {
  static defaultProps = {
    mode: 'vertical',
    onClick: () => {},
    activeId: '',
    mini: false,
    miniToggle: false,
    fatMenu: false,
    accordion: true
  }
  static propTypes = {
    datas: PropTypes.arrayOf(PropTypes.shape({
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
    mode: PropTypes.oneOf(['horizontal', 'vertical']),
    mini: PropTypes.bool, // 是否是mini模式，需要同时mode=vertical时才生效
    miniToggle: PropTypes.bool, // mini状态开关，需要同时mode=vertical时才生效
    fatMenu: PropTypes.bool, // 胖菜单，需要同时mode=horizontal时才生效
    accordion: PropTypes.bool,
    onClick: PropTypes.func,
    onClickSubMenu: PropTypes.func,
    onMiniChange: PropTypes.func
  }

  constructor (props) {
    super(props)

    const {
      activeId,
      mini
    } = this.props
    const activeIndex = this.getActiveIndex(activeId)
    let expandIndex = []
    this.clickOutsideHandel = this.clickOutside.bind(this)

    if (this.isNoMiniVertaicalMenu(mini)) { // 垂直非mini菜单默认打开激活项
      expandIndex = [activeIndex.split('-').slice(0, -1).join('-')]
    }

    this.state = {
      activeId: this.props.activeId,
      expandIndex,
      activeIndex,
      mini
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeId !== this.props.activeId) {
      const activeIndex = this.getActiveIndex(nextProps.activeId)

      this.setState({
        activeId: nextProps.activeId,
        activeIndex
      })
    }

    if (nextProps.mini !== this.props.mini) {
      this.setState({
        mini: nextProps.mini
      })
    }
  }

  componentDidMount () {
    window.addEventListener('click', this.clickOutsideHandel)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.clickOutsideHandel)
  }

  clickInsideFlag = false // click在menu标识
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

  isNoMiniVertaicalMenu (mini = this.state.mini) { // 垂直非mini菜单
    return this.props.mode === 'vertical' && !mini
  }

  getActiveMenus = (menus, activeId, activeMenus = []) => {
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

  getActiveIndex (activeId) {
    // 获取激活item对应的索引，以'-'拼接成字符串
    const { datas } = this.props

    if (activeId === undefined || activeId === '') {
      return ''
    }
    const activeMenus = this.getActiveMenus(datas, activeId, [])
    return (activeMenus && activeMenus.join('-')) || ''
  }

  toggleMini () {
    const mini = !this.state.mini
    const expandIndex = mini ? [] : this.state.expandIndex // 切换为mini清空展开态，否则记录展开态

    setTimeout(() => { // fix mini 切换为 非mini 时子菜单不隐藏
      this.setState({
        mini,
        expandIndex
      }, () => {
        this.props.onMiniChange && this.props.onMiniChange(mini)
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

  renderFatSubMenu (datas, parentIndex) { // render胖菜单
    let groups = []

    datas.forEach((data, groupIndex) => {
      groups.push(
        <li className='hi-menu-fat' key={groupIndex}>
          <div className='hi-menu-fat__title hi-menu__title'>
            <Title icon={data.icon} content={data.content} />
          </div>
          <ul className='hi-menu-fat__content'>
            {
              data.children.map((child, index) => {
                return this.renderItem(child, parentIndex + '-' + groupIndex + '-' + index, {level: 2})
              })
            }
          </ul>
        </li>
      )
    })
    return groups
  }

  renderMenu (datas, parentIndex = '') {
    const {fatMenu, mode} = this.props
    const {
      activeIndex,
      expandIndex,
      mini
    } = this.state
    let items = []
    const renderMenu = fatMenu ? this.renderFatSubMenu.bind(this) : this.renderMenu.bind(this)

    datas.forEach((data, index) => {
      const indexStr = parentIndex !== '' ? parentIndex + '-' + index : '' + index
      const level = indexStr.split('-').length

      if (data.children) {
        items.push(
          <SubMenu
            key={index}
            onClick={this.onClickSubMenu.bind(this)}
            clickInside={this.clickInside.bind(this)}
            index={indexStr}
            level={level}
            fatMenu={fatMenu}
            activeIndex={activeIndex}
            expandIndex={expandIndex}
            disabled={data.disabled}
            content={data.content}
            icon={data.icon}
            renderMenu={renderMenu}
            datas={data.children}
            mode={mode}
            mini={mini}
          />
        )
      } else {
        items.push(this.renderItem(data, indexStr, {level}))
      }
    })

    return items
  }

  render () {
    const {datas, mode, miniToggle} = this.props
    const {mini} = this.state
    const cls = classNames('hi-menu', `hi-menu--${mode}`, {
      'hi-menu--mini': mini
    })
    const miniIcon = mini ? 'double-right' : 'double-left'

    return (
      <div className={cls}>
        <ul className='hi-menu-items'>
          { this.renderMenu(datas) }
        </ul>
        {
          mode === 'vertical' && miniToggle &&
          <div
            className='hi-menu--mini__toggle'
            onClick={this.toggleMini.bind(this)}
          >
            <Icon name={miniIcon} />
          </div>
        }
      </div>
    )
  }
}

export default Menu
