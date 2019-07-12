/* @flow */

import { Component } from 'react'
import PropTypes from 'prop-types'

class Option extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string
  }

  static defaultProps = {
    disabled: false
  }

  componentWillMount () {
    const {
      name,
      id,
      disabled,
      children
    } = this.props

    this.parent().addOption({
      name,
      id,
      disabled,
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
