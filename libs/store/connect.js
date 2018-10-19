import { createElement, Component } from 'react'
import shallowEqual from 'shallowequal'
import hoistStatics from 'hoist-non-react-statics'
import { storeShape } from './PropTypes'

function getDisplayName (WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const defaultMapStateToProps = () => ({})

export default function connect (mapStateToProps) {
  const shouldSubscribe = !!mapStateToProps
  const finnalMapStateToProps = mapStateToProps || defaultMapStateToProps

  return function wrapWithConnect (WrappedComponent) {
    class Connect extends Component {
      static displayName = `Connect(${getDisplayName(WrappedComponent)})`

      static contextTypes = {
        store: storeShape.isRequired
      }

      constructor (props, context) {
        super(props, context)

        this.store = context.store
        this.state = {
          subscribed: finnalMapStateToProps(this.store.getState(), props)
        }
      }

      componentDidMount () {
        this.trySubscribe()
      }

      componentWillUnmount () {
        this.tryUnsubscribe()
      }

      handleChange = () => {
        if (!this.unsubscribe) {
          return
        }

        const nextState = finnalMapStateToProps(
          this.store.getState(),
          this.props
        )
        if (!shallowEqual(this.nextState, nextState)) {
          this.nextState = nextState
          this.setState({ subscribed: nextState })
        }
      }

      trySubscribe () {
        if (shouldSubscribe) {
          this.unsubscribe = this.store.subscribe(this.handleChange)
          this.handleChange()
        }
      }

      tryUnsubscribe () {
        if (this.unsubscribe) {
          this.unsubscribe()
          this.unsubscribe = null
        }
      }

      render () {
        return createElement(WrappedComponent, {
          ...this.props,
          ...this.state.subscribed,
          store: this.store
        })
      }
    }

    return hoistStatics(Connect, WrappedComponent)
  }
}
