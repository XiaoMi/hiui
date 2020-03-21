import React from 'react'
import Watermark from './watermark'
function randomString (len) {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let pwd = ''
  len = len || 32
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
class WatermarkComponent extends React.Component {
  constructor (props) {
    super(props)

    this.rootRef = React.createRef()
  }
  componentDidMount () {
    // 生成随机ID;如果不传入ID的话;
    const container = this.rootRef.current
    const {props} = this
    const options = {
      id: props.id || 'hi-' + randomString(4),
      contents: this.props.contents || ['HIUI', '做中台，就用 HIUI'],
      rotate: props.rorate || -30,
      logo: props.logo,
      ...props
    }
    Watermark(container, options)
  }
  render () {
    return (
      <div ref={this.rootRef} style={{ overflow: 'hidden' }}>
        {this.props.children}
      </div>
    )
  }
}
export default WatermarkComponent
export { Watermark }
