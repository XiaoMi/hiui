import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class Container extends React.Component {
  static propTypes = {
    autoMount: PropTypes.bool,
    autoDestroy: PropTypes.bool,
    visible: PropTypes.bool,
    forceRender: PropTypes.bool,
    parent: PropTypes.any,
    getComponent: PropTypes.func.isRequired,
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    autoMount: true,
    autoDestroy: true,
    forceRender: false
  }

  componentDidMount () {
    if (this.props.autoMount) {
      this.renderComponent()
    }
  }

  componentDidUpdate () {
    if (this.props.autoMount) {
      this.renderComponent()
    }
  }

  componentWillUnmount () {
    if (this.props.autoDestroy) {
      this.removeContainer()
    }
  }

  removeContainer = () => {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container)
      this.container.parentNode.removeChild(this.container)
      this.container = null
    }
  }

  renderComponent = (props, ready) => {
    const { visible, getComponent, forceRender, getContainer, parent } = this.props
    if (visible || parent._component || forceRender) {
      if (!this.container) {
        this.container = getContainer()
      }
      ReactDOM.unstable_renderSubtreeIntoContainer(
        parent,
        getComponent(props),
        this.container,
        function callback () {
          if (ready) {
            ready.call(this)
          }
        }
      )
    }
  }

  render () {
    return this.props.children({
      renderComponent: this.renderComponent,
      removeContainer: this.removeContainer
    })
  }
}
