import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
const prefix = 'input-type'
const code = `
import React from 'react'
import Grid from '@hiui/hiui/es/grid'
import Radio from '@hiui/hiui/es/radio'
import Input from '@hiui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      types: [{
        id: 'text',
        content: '普通'
      }, {
        id: 'id',
        content: '身份证'
      }, {
        id: 'tel',
        content: '手机号'
      }, {
        id: 'amount',
        content: '浮点数'
      }],
      value: 'text'
    }
    this.getPlaceholder = () => {
      return {
        text: '请输入...',
        id: '请输入身份证号',
        tel: '请输入手机号码',
        amount: '请输入浮点数'
      }[this.state.value]
    }
  }
  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const { types, type, value } = this.state
    return (
      <div>
        <Row gutter>
          <Col span={12}>
            <Radio.Group
              data={types}
              type='button'
              value={value}
              onChange={(value) => {
                this.setState({ value })
              }}
            />
          </Col>
        </Row>
        <Row gutter>
          <Col span={12}>
            <Input
              type={type}
              placeholder={this.getPlaceholder()}
              style={{ width: 250 }}
            />
          </Col>
        </Row>
      </div>
    )
  }
}`

const DemoType = () => (
  <DocViewer
    code={code}
    scope={{ Grid, Input, Radio }}
    prefix={prefix}
  />
)
export default DemoType
