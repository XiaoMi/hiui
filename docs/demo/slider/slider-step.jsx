import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Slider from '../../../components/slider'
const prefix = 'slider-step'
const rightOptions = ['水平', '竖直']
const desc = '按定义步长输入离散型数值，可加入特殊位置'

const code = [
  {
    code: `import React from 'react'
import Slider from '@hi-ui/hiui/es/slider'\n
class Demo extends React.Component {

  constructor() {
    super()
    this.state = {
      value: 30,
      marks:{
        0: '0°C',
        26: '26°C',
        37: '37°C',
        100: '100°C',
      }
    }
  }

  render() {
    const {value,marks} = this.state
    return (
      <Slider defaultValue={value} marks={marks}/>
    )
  }
}`,
    opt: ['水平']
  },
  {
    code: `import React from 'react'
import Slider from '@hi-ui/hiui/es/slider'\n
class Demo extends React.Component {

  constructor() {
    super()
    this.state = {
      value: 30,
      marks:{
        0: '0°C',
        26: '26°C',
        37: '37°C',
        100: '100',
      }
    }
  }  
  render() {
    const {value,marks} = this.state
    return (
      <div
          style={{
            height: 300,
            width: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft:50
          }}
        >
      <Slider defaultValue={value} step={9} vertical marks={marks}/>
      </div>
    )
  }
}`,
    opt: ['竖直']
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Slider }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoBase
