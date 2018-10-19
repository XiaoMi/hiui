import React, { Component } from 'react'
import axios from 'axios'

export const getData = WrappedComponent => {
  return class LogHoc extends Component {
    constructor (props) {
      super(props)
      this.url = this.props.dataUrl
      this.state = {
        data: []
      }
    }
    componentWillMount () {
      axios.get(this.url).then(response => {
        this.setState({ data: response.data })
      })
    }
    render () {
      return <WrappedComponent data={this.state.data} />
    }
  }
}
