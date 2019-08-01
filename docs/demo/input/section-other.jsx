import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
const prefix = 'input-other'

const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.list = [{
      content: '前缀',
      id: 'prepend'
    }, {
      content: '后缀',
      id: 'append'
    }, {
      content: '两者',
      id: 'both'
    }]
    this.state = {
      value: 'prepend'
    }
    this.getFix = () => {
      return {
        prepend: {
          prepend: '+86',
          placeholder: '010-12345678'
        },
        append: {
          append: '@xiaomi.com',
          placeholder: 'mife'
        },
        both: {
          prepend: 'www.',
          append: '.com',
          placeholder: 'mi'
        }
      }[this.state.value]
    }
  }
  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const { value } = this.state
    const { prepend, append, placeholder } = this.getFix()
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
              style={{ width: 250 }}
              append={append}
              prepend={prepend}
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
