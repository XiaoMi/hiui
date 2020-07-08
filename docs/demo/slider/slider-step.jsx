import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Slider from '../../../components/slider'
const prefix = 'slider-color'
const desc =
  '按定义步长输入离散型数值，可加入特殊位置'

const code = `import React from 'react'
import Slider from '@hi-ui/hiui/es/slider'\n
class Demo extends React.Component {

  constructor() {
    super()
    this.state = {
      value: 99
    }
  }

  render() {
    const {value} = this.state
    return (
      <Slider value={value} step={9} max={99} min={10}/>
      
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
