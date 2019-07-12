import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Grid from '../../../components/grid'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
const prefix = 'input-other'

const code = `
import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Radio from '@hi-ui/hiui/es/radio'
import Input from '@hi-ui/hiui/es/input'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      prefix: '+86',
      suffix: '',
      checkedIndex: 0,
      placeholder: '010-12345678',
      list: [{
        name: '前缀',
        prefix: '+86',
        placeholder: '010-12345678'
      }, {
        name: '后缀',
        suffix: '@xiaomi.com',
        placeholder: 'mife'
      }, {
        name: '两者',
        prefix: 'www.',
        suffix: '.com',
        placeholder: 'mi'
      }]
    }
  }
  render() {
    const Row = Grid.Row
    const Col = Grid.Col
    const {list, prefix, suffix, placeholder, checkedIndex} = this.state
    return (
      <div>
        <Row gutter={true}>
          <Col span={12}>
            <Radio
              list={list}
              mode='button'
              checked={checkedIndex}
              onChange={(data, index, item) => {
                this.setState({
                  placeholder: item.placeholder,
                  checkedIndex: index,
                  prefix: item.prefix || '',
                  suffix: item.suffix || '',
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
              suffix={suffix}
              prefix={prefix}
            />
          </Col>
        </Row>
      </div>
    )
  }
}`
const DemoOther = () => <DocViewer code={code} scope={{ Grid, Input, Radio }} prefix={prefix} />
export default DemoOther
