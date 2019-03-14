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
        childIsActive = this.submenu && this.submenu.childIsActive

        props = Object.assign(props, {
          rootComponent: this.context.component,
          ref: node => { this.submenu = node }
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
