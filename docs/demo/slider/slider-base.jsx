import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Slider from '../../../components/slider'
const prefix = 'slider-base'
const rightOptions = ['基础', '禁用', '可控范围']
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
      
        render() {
          return (
            <Slider defaultValue={10} onChange={(value)=>{console.log(value)}} value={this.state.value}/>
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
            <Slider defaultValue={50} onChange={(value)=>{console.log(value)}} value={this.state.value} disabled/>
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
            <Slider value={this.state.value}  min={1} max={90}/>
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
