import React, { Component } from 'react'
import PropTypes from 'prop-types'

class MixinMenu extends Component {
  root () {
    return this.context.component
  }

  onClick (id) {
    const root = this.root()

    root.onClick(id)
  }

  renderChildren (children) {
    const {
      activeId
    } = this.root().state
    let childIsActive = false
    const enhancedChildren = React.Children.map(children, child => {
      if (child.props.id === activeId) {
        childIsActive = true
      }
      if (child.type.componentName === 'MenuItem') {
        return React.cloneElement(child, {
          onClick: this.onClick.bind(this),
          activeId
        })
      }
      return child
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
