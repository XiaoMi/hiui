import React from 'react'
import Watermark from './watermark'
class WatermarkComponent extends React.Component {
  constructor (props) {
    super(props)
    console.log('props', props)
    this.rootRef = React.createRef()
  }
  componentDidMount () {
    const { contents, rotate, logo } = this.props
    const options = {contents, rotate, logo}
    const container = this.rootRef.current
    Watermark(container, options)
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
// export {Watermark}
