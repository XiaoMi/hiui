import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
import Select from '../../../components/select'
import Button from '../../../components/button'
import Message from '../../../components/message'
const prefix = 'input-position'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Button from '@hi-ui/hiui/es/button'
import Select from '@hi-ui/hiui/es/select'
import Radio from '@hi-ui/hiui/es/radio'
import Message from '@hi-ui/hiui/es/message'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    const ele = <Select
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
    this.state = {
      radioList: [{
        content: '前置元素',
        id: 'prepend'
      }, {
        content: '后置元素',
        id: 'append'
      }],
      value: 'prepend'
    }
    this.getFix = () => {
      return {
        prepend: {
          prepend: ele
        },
        append: {
          append: <Button type="primary" onClick={() => {
            Message.open({ type: 'success', title: '查询成功', duration: 2000 })
          }}>查询</Button>
        }
      }[this.state.value]
    }
  }
  render() {
    const {
      value,
      radioList
    } = this.state
    const { prepend, append } = this.getFix()
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
        <Row gutter>
          <Col span={12}>
            <Radio.Group
              data={radioList}
              value={value}
              type='button'
              onChange={(value) => {
                this.setState({ value })
              }}
            />
          </Col>
        </Row>
        <Row gutter>
          <Col span={12}>
            <Input
              id="customId"
              type="tel"
              placeholder="请输入手机号"
              prepend={prepend}
              append={append}
              style={{ width: 250 }}
            />
          </Col>
        </Row>
      </div>
    )
  }
}`
const DemoPosition = () => (
  <DocViewer
    code={code}
    scope={{ Grid, Input, Radio, Select, Button, Message }}
    prefix={prefix}
  />
)
export default DemoPosition
