import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
import Select from '../../../components/select'
import Button from '../../../components/button'
import Message from '../../../components/message'
import Icon from '../../../components/icon'
const prefix = 'input-position'
const desc = '将输入与其他元素组合使用'
const leftOptions = ['前置', '后置', '前后置']
const code = [
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  render() {
    const append = <Button type="default" icon='search' onClick={() => {
      Message.open({ type: 'success', title: '查询成功', duration: 2000 })
    }} />
    return (<Input
    id="customId"
    type="tel"
    placeholder="请输入"
    append={append}
    style={{ width: 250 }}
  />)
  }
}`,
    opt: ['后置']
  },
  {
    code: `import React from 'react'
import Select from '@hi-ui/hiui/es/select'
import Message from '@hi-ui/hiui/es/message'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    
  }
  render() {
    const prepend = <Select
      type='single'
      clearable={false}
      style={{ width: 80 }}
      data={[
        { title:'+86', id:'86' },
        { title:'+1', id:'1' },
        { title:'+33', id:'33' },
        { title:'+91', id:'91' },
      ]}
      defaultValue='86'
    />
    return (<Input
    id="customId"
    type="tel"
    placeholder="请输入"
    prepend={prepend}
    style={{ width: 250 }}
  />)
  }
}`,
    opt: ['前置']
  },
  {
    code: `import React from 'react'
import Select from '@hi-ui/hiui/es/select'
import Message from '@hi-ui/hiui/es/message'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    
  }
  render() {
    return (
      <div>
        <Input
          id="customId"
          type="tel"
          placeholder="请输入"
          prepend={'http://'}
          append={'.com'}
          style={{ width: 250 }}
        />
    </div>
  )
  }
}`,
    opt: ['前后置']
  }
]
const DemoPosition = () => (
  <DocViewer
    code={code}
    desc={desc}
    leftOptions={leftOptions}
    scope={{ Grid, Input, Radio, Select, Button, Message, Icon }}
    prefix={prefix}
  />
)
export default DemoPosition
