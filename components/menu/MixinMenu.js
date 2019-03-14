import React, { Component } from 'react'
import PropTypes from 'prop-types'

class MixinMenu extends Component {
  root () {
    return this.context.component || this.props.rootComponent
  }

  onClick (id) {
    const root = this.root()

    root.onClick(id)
  }

  isActive (children, activeId) {
    let active = false

    React.Children.forEach(children, child => {
      if (active) {
        return
      }
      if (child.type.componentName === 'MenuItem') {
        if (child.props.id === activeId) {
          active = true
        }
      } else {
        active = this.isActive(child.props.children, activeId)
      }
    })
    return active
  }

  renderChildren (children, parentComponent) {
    const {
      activeId
    } = this.root().state
    let childIsActive = false
    const enhancedChildren = React.Children.map(children, child => {
      let props = {
        parentComponent
      }
      // console.log('----------child', child)
      if (child.type.componentName === 'MenuItem') {
        if (child.props.id === activeId) {
          childIsActive = true
        }
        props = Object.assign(props, {
          onClick: this.onClick.bind(this),
          activeId
        })
      } else if (child.type.componentName === 'SubMenu') {
        const active = this.isActive(child.props.children, activeId)
        if (active) {
          childIsActive = active
        }
        console.log('----------child', childIsActive)

        props = Object.assign(props, {
          // showParentSubmenu: ((this.state && this.state.showSubmenu) || this.props.showParentSubmenu) && active,
          rootComponent: this.context.component
        })
      } else {
        props = Object.assign(props, {
          rootComponent: this.context.component
        })
      }

      return React.cloneElement(child, props)
    })

    return {
      children: enhancedChildren,
      childIsActive
    }
  }
}

MixinMenu.contextTypes = {
  component: PropTypes.any
}

export default MixinMenu
