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
      disabled: false,
      required: false,
      checkedIndex: 0,
      placeholder: '禁用状态',
      list: [{
        id: 'disabled',
        name: '禁用状态'
      }, {
        id: 'required',
        name: '必填项'
      }]
    }
  }
  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const {list, required, disabled, placeholder, checkedIndex} = this.state
    return (
      <div>
        <Row gutter={true}>
          <Col span={12}>
            <Radio
              list={list}
              mode='button'
              checked={checkedIndex}
              onChange={(data, index) => {
                this.setState({
                  placeholder: list[index].name,
                  checkedIndex: index,
                  required: data === 'required',
                  disabled: data === 'disabled'
                })
              }}
            />
          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={12}>
             <Input
              value=""
              placeholder={placeholder}
              style={{width: '250px'}}
              required={required}
              disabled={disabled}
            />
          </Col>
        </Row>

      </div>
    )
  }
}`
const DemoState = () => (
  <DocViewer
    code={code}
    scope={{ Grid, Input, Radio }}
    prefix={prefix}
  />
)
export default DemoState
