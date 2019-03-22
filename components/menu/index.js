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
    accordion: false
  }
  static propTypes = {
    datas: PropTypes.shape({
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      disabled: PropTypes.bool,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      children: PropTypes.array
    }),
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

    this.state = {
      activeId: this.props.activeId,
      activeIndex,
      expandIndex: '',
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

  getActiveIndex (activeId) { // 获取激活item对应的索引，以'-'拼接成字符串
    const {
      datas
    } = this.props
    let activeIndex = []
    let level = 0

    if (activeId === undefined) {
      return activeIndex
    }

    const _getActiveIndex = function (datas) {
      for (const index in datas) {
        const data = datas[index]
        activeIndex[level] = parseInt(index)
        if (data.children) {
          level++
          _getActiveIndex(data.children)
        } else if (data.id === activeId) {
          break
        }
      }
    }
    _getActiveIndex(datas)
    return activeIndex.join('-')
  }

  toggleMini () {
    let mini = !this.state.mini

    this.setState({
      mini
    }, () => {
      this.props.onMiniChange && this.props.onMiniChange(mini)
    })
  }

  onClick (indexs, id) {
    const oldId = this.state.activeId

    this.setState({
      activeIndex: indexs,
      expandIndex: ''
    }, () => {
      this.props.onClick(id, oldId)
    })
  }

  onClickSubMenu (index) {
    this.setState({
      expandIndex: index
    }, () => {
      index && this.props.onClickSubMenu && this.props.onClickSubMenu(index)
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
      isActive: activeIndex.indexOf(index) === 0,
      index: index,
      disabled: data.disabled,
      key: data.id
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
                return this.renderItem(child, parentIndex + '-' + groupIndex + '-' + index)
              })
            }
          </ul>
        </li>
      )
    })
    return groups
  }

  renderMenu (datas, parentIndex = '') {
    const {fatMenu, mode, mini} = this.props
    const {
      activeIndex,
      expandIndex
    } = this.state
    let items = []
    const renderMenu = fatMenu ? this.renderFatSubMenu.bind(this) : this.renderMenu.bind(this)

    datas.forEach((data, index) => {
      const indexStr = parentIndex !== '' ? parentIndex + '-' + index : '' + index
      if (data.children) {
        items.push(
          <SubMenu
            onClick={this.onClickSubMenu.bind(this)}
            index={indexStr}
            fatMenu={fatMenu}
            isActive={activeIndex.indexOf(indexStr) === 0}
            isExpand={expandIndex.indexOf(indexStr) === 0}
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
        items.push(this.renderItem(data, indexStr))
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
