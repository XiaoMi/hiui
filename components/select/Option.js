/* @flow */

import { Component } from 'react'
import PropTypes from 'prop-types'

class Option extends Component {
  componentWillMount () {
    const {
      name,
      id,
      children
    } = this.props

    this.parent().addOption({
      name,
      id,
      children
    })
  }

  parent () {
    return this.context.component
  }

  render () {
    return null
  }
}

Option.contextTypes = {
  component: PropTypes.any
}

export default Option
