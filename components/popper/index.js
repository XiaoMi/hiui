import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import Portal from './Portal'
import Overlay from './Overlay'
import PopperJS from './utils/popper'

import './style/index'

const { getScrollParent } = new PopperJS()
const AnimationClassName = 'hi-popper_transition'

export default class Popper extends Component {
  constructor (props) {
    super(props)
    const { show } = props
    this.state = {
      staticShow: show,
      transitionShow: show,
      container: props.container || document.body
    }
  }
  static getDerivedStateFromProps (nextProps) {
    const { attachEle, container, show } = nextProps
    const _container = attachEle ? getScrollParent(attachEle) : document.body
    return {
      container: container || _container,
      transitionShow: show,
      staticShow: show || false
    }
  }
  render () {
    const { transitionShow, container, staticShow } = this.state
    return (
      <div>
        <CSSTransition
          in={transitionShow}
          timeout={300}
          classNames={AnimationClassName}
          onExited={() => {
            this.setState({
              staticShow: false
            })
          }}
        >
          <Portal container={container}>
            <Overlay
              {...Object.assign({}, this.props, { show: staticShow })}
              container={container}
            />
          </Portal>
        </CSSTransition>
      </div>
    )
  }
}
export { Portal }
