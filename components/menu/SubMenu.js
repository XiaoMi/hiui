import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MixinMenu from './MixinMenu'
import Popper from '../popper'
import Icon from '../icon'

export default class SubMenu extends MixinMenu {
  static componentName = 'SubMenu'

  static propTypes = {
    title: PropTypes.string,
    showParentSubmenu: PropTypes.bool
  }

  static defaultProps = {
    showParentSubmenu: false
  }

  constructor (props) {
    super(props)

    this.state = {
      showSubmenu: false
    }
    this.clickOutsideHandel = this.clickOutside.bind(this)
  }

  componentDidMount () {
    window.addEventListener('click', this.clickOutsideHandel)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.clickOutsideHandel)
  }

  clickOutside (e) {
    if (
      (ReactDOM.findDOMNode(this.submenuTrigger) && ReactDOM.findDOMNode(this.submenuTrigger).contains(e.target)) ||
      (ReactDOM.findDOMNode(this.submenuNode) && ReactDOM.findDOMNode(this.submenuNode).contains(e.target))
    ) {
      return
    }
    this.hidePopper()
  }

  hidePopper () {
    this.setState({
      showSubmenu: false
    })
  }

  onClick (id) {
    this.setState({
      showSubmenu: false
    })
    super.onClick(id)
  }

  render () {
    let {
      showSubmenu
    } = this.state
    const {
      title,
      parentComponent,
      showParentSubmenu
    } = this.props
    const {
      children,
      childIsActive,
      childrenType
    } = this.renderChildren(this.props.children, SubMenu.componentName)
    const deepSubmenu = parentComponent === 'SubMenu' || parentComponent === 'ItemGroup'
    const cls = classNames('hi-menu-item', 'hi-submenu', {
      'hi-menu-item--active': childIsActive,
      'hi-submenu--sub': deepSubmenu
    })
    showSubmenu = showSubmenu || showParentSubmenu
    let leftGap
    let topGap
    let placement
    let icon
    if (deepSubmenu) {
      leftGap = 16
      topGap = -4
      placement = 'right-start'
      icon = showSubmenu ? 'left' : 'right'
    } else {
      leftGap = 0
      topGap = 5
      placement = 'bottom-start'
      icon = showSubmenu ? 'up' : 'down'
    }
    // console.log('----------childIsActive', this.props.parentComponent)

    return (
      <li
        className={cls}
        ref={node => { this.submenuTrigger = node }}
        onClick={() => {
          this.setState({
            showSubmenu: true
          })
        }}
      >
        <div className='hi-menu-item__title'>
          {title}
        </div>
        <div className='hi-menu-item__expand-icon'>
          <Icon name={icon} />
        </div>
        <Popper
          show={showSubmenu}
          attachEle={this.submenuTrigger}
          zIndex={1050}
          topGap={topGap}
          leftGap={leftGap}
          className={
            classNames('hi-submenu__popper', {'hi-submenu__popper--group': childrenType === 'ItemGroup'})
          }
          width={false}
          placement={placement}
        >
          <ul className='hi-submenu__content' ref={node => { this.submenuNode = node }}>
            {children}
          </ul>
        </Popper>
      </li>
    )
  }
}
