import React, { Component } from 'react'
import { LiveContext } from 'react-live'

export default function withLive(WrappedComponent) {
  class WithLive extends Component {
    render() {
      return (
        <LiveContext.Consumer>
          {(live) => <WrappedComponent live={live} {...this.props} ref={this.props.refer} />}
        </LiveContext.Consumer>
      )
    }
  }

  return WithLive
}
