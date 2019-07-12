import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
const prefix = 'input-state'
const code = `
import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      list: [{
        id: 'disabled',
        content: '禁用状态'
      }, {
        id: 'required',
        content: '必填项'
      }],
      value: 'disabled'
    }
  }
  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const { list, required, disabled, value } = this.state
    return (
      <div>
        <Row gutter>
          <Col span={12}>
            <Radio.Group
              data={list}
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
              style={{ width: 250 }}
              placeholder='请输入'
              required={value === 'required'}
              disabled={value === 'disabled'}
            />
          </Col>
        </Row>
      </div>
    )
  }
}`
const DemoState = () => <DocViewer code={code} scope={{ Grid, Input, Radio }} prefix={prefix} />
export default DemoState
