import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
const prefix = 'input-type'
const code = `
import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      types: [{
        id: 'text',
        name: '普通',
        placeholder: '请输入...'
      }, {
        id: 'id',
        name: '身份证',
        placeholder: '请输入身份证号'
      }, {
        id: 'tel',
        name: '手机号',
        placeholder: '请输入手机号码'
      }, {
        id: 'amount',
        name: '浮点数',
        placeholder: '请输入浮点数'
      }],
      type: 'text',
      checkedIndex: 0,
      placeholder: '请输入...'
    }
  }
  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const {types, type, checkedIndex, placeholder} = this.state
    return (
      <div>
        <Row gutter={true}>
          <Col span={12}>
            <Radio
              list={types}
              mode='button'
              checked={checkedIndex}
              onChange={(data, index) => {
                this.setState({
                  type: data,
                  checkedIndex: index,
                  placeholder: types[index].placeholder
                })
              }}
            />
          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={12}>
            <Input
              type={type}
              placeholder={placeholder}
              style={{width: '250px'}}
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
