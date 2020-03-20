import React from 'react'
import Watermark from './watermark'
class WatermarkComponent extends React.Component {
  constructor (props) {
    super(props)
    console.log('props', props)
    this.rootRef = React.createRef()
  }
  componentDidMount () {
    const options2 = {logo: '', rotate: -30, contents: ['HIUI', '做中台，就用 HIUI']}
    const { contents, rotate, logo } = this.props
    const options = {contents, rotate, logo}
    const container = this.rootRef.current
    console.log('options', options, '+++++++++++')
    Watermark(container, options2)
  }
  render () {
    return (
      <div ref={this.rootRef} id='suiying'>
        {this.props.children}
      </div>
    )
  }
}

export default WatermarkComponent
export {Watermark}
