import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
import Select from '../../../components/select'
import Button from '../../../components/button'
const prefix = 'input-position'
const code = `
import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Button from '@hi-ui/hiui/es/button'
import Select from '@hi-ui/hiui/es/select'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    const ele = <Select
      mode='single'
      clearable={false}
      style={{width: '80px'}}
      list={[
        { name:'+86', id:'86' },
        { name:'+1', id:'1' },
        { name:'+33', id:'33' },
        { name:'+91', id:'91' },
      ]}
      value='86'
      onChange={(item) => {
        console.log('单选结果', item)
        const selectValue = item[0].id
        this.setState({selectValue, tel: \`\${selectValue} \${value}\`})
      }}
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
          append: <Button type="primary">搜索</Button>
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
    scope={{ Grid, Input, Radio, Select, Button }}
    prefix={prefix}
  />
)
export default DemoPosition
