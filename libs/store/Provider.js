import { Component, Children } from 'react'
import { storeShape } from './PropTypes'

export default class Provider extends Component {
  static propTypes = {
    store: storeShape.isRequired
  }

  static childContextTypes = {
    store: storeShape.isRequired
  }

  getChildContext () {
    return {
      store: this.props.store
    }
  }

  render () {
    return Children.only(this.props.children)
  }
}
