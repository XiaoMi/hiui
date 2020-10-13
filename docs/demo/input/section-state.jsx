import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const leftOptions = ['基础', '默认值', '禁用', '可清除', '自动聚焦', '手动聚焦']
const prefix = 'input-state'
const desc = '可获取有限长度的字符串，不折行显示'
const code = [
  {
    code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        style={{ width: 250 }}
        placeholder='请输入'
      />
    )
  }
}`,
    opt: ['基础']
  },
  {
    code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        style={{ width: 250 }}
        placeholder='请输入'
        disabled
      />
    )
  }
}`,
    opt: ['禁用']
  },
  {
    code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        style={{ width: 250 }}
        placeholder='请输入'
        defaultValue='默认值'
      />
    )
  }
}`,
    opt: ['默认值']
  },
  {
    code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        autoFocus
        style={{ width: 250 }}
        placeholder='请输入'
        defaultValue='默认值'
      />
    )
  }
}`,
    opt: ['自动聚焦']
  },
  {
    code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {

  constructor(props){
    super(props)
    this.input = React.createRef()
  }

  render() {
    return (
      <div>
        <Button onClick={()=>{
          this.input.current.focus()
        }}>手动聚焦</Button>
        <p/>
        <Input
          ref={this.input}
          style={{ width: 250 }}
          placeholder='请输入'
          defaultValue='默认值'
        />
      </div>
     
    )
  }
}`,
    opt: ['手动聚焦']
  },
  {
    code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    return (
      <Input
        style={{ width: 250 }}
        placeholder='请输入'
        clearable
      />
    )
  }
}`,
    opt: ['可清除']
  }
]
const DemoState = () => (
  <DocViewer desc={desc} leftOptions={leftOptions} code={code} scope={{ Grid, Input, Radio, Button }} prefix={prefix} />
)
export default DemoState
