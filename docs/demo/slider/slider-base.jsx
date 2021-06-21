import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Slider from '../../../components/slider'
const prefix = 'slider-base'
const rightOptions = ['基础', '可控范围', '禁用']
const desc =
  '滑动输入连续或离散数据的单点值或范围值'

const code = [
  {
    code: `import React from 'react'
import Slider from '@hi-ui/hiui/es/slider'\n
class Demo extends React.Component {

  constructor() {
    super()
    this.state = {
      value: 10
    }
  }

  onChange(v){
    // console.log(v)
    this.setState({
      value:v
    })
  }
  
  render() {
    const {value} = this.state
    return (
      <Slider value={value}  onChange={(value)=>this.onChange(value)}/>
    )
  }
}`,
    opt: ['基础']
  },
  {
    code: `import React from 'react'
import Slider from '@hi-ui/hiui/es/slider'\n
class Demo extends React.Component {

  constructor() {
    super()
    this.state = {
      value: 40
    }
  }

  render() {
    return (
      <Slider onChange={(value)=>{console.log(value)}} defaultValue={this.state.value} disabled/>
    )
  }
}`,
    opt: ['禁用']
  },
  {
    code: `import React from 'react'
import Slider from '@hi-ui/hiui/es/slider'\n
class Demo extends React.Component {

  constructor() {
    super()
    this.state = {
      value: 80
    }
  }

  render() {
    return (
      <Slider defaultValue={this.state.value}  min={1} max={90}/>
    )
  }
}`,
    opt: ['可控范围']
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
