import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
const prefix = 'input-other'

const code = `
import React from 'react'
import Grid from '@hiui/hiui/es/grid'
import Radio from '@hiui/hiui/es/radio'
import Input from '@hiui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.list = [{
      content: '前缀',
      id: 'prefix'
    }, {
      content: '后缀',
      id: 'suffix'
    }, {
      content: '两者',
      id: 'both'
    }]
    this.state = {
      value: 'prefix'
    }
    this.getFix = () => {
      return {
        prefix: {
          prefix: '+86',
          placeholder: '010-12345678'
        },
        suffix: {
          suffix: '@xiaomi.com',
          placeholder: 'mife'
        },
        both: {
          prefix: 'www.',
          suffix: '.com',
          placeholder: 'mi'
        }
      }[this.state.value]
    }
  }
  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const { value } = this.state
    const { prefix, suffix, placeholder } = this.getFix()
    return (
      <div>
        <Row gutter>
          <Col span={12}>
            <Radio.Group
              data={this.list}
              value={value}
              type='button'
              onChange={value => {
                this.setState({ value })
              }}
            />
          </Col>
        </Row>
        <Row gutter>
          <Col span={12}>
            <Input
              placeholder={placeholder}
              style={{width: 250}}
              suffix={suffix}
              prefix={prefix}
            />
          </Col>
        </Row>
      </div>
    )
  }
}`

const DemoOther = () => (
  <DocViewer
    code={code}
    scope={{ Grid, Input, Radio }}
    prefix={prefix}
  />
)

export default DemoOther
