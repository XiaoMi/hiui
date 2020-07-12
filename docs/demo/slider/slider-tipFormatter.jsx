import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Slider from '../../../components/slider'
const prefix = 'slider-tipFormatter'
const desc =
  '可自定义提示内容的格式'

const code = `import React from 'react'
import Slider from '@hi-ui/hiui/es/slider'\n
class Demo extends React.Component {

  constructor() {
    super()
    this.state = {
      value: 80
    }
  }

  formatter(value){
    console.log(value)
    return value+'英寸'
  }

  render() {
    return (
      <Slider defaultValue={this.state.value}   tipFormatter={this.formatter}/>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Slider }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoBase
