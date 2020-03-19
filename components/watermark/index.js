import React from 'react'
import Watermark from './watermark'
class WatermarkComponent extends React.Component {
  constructor (props) {
    super(props)
    this.rootRef = React.createRef()
  }
  componentDidMount () {
    Watermark(this.rootRef)
  }
  render () {
    return (
      <div ref={this.rootRef}>
        {this.props.children}
      </div>
    )
  }
}

export default WatermarkComponent
export {Watermark}
