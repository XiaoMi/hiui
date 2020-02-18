import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Progress from '../../../components/progress'
import Grid from '../../../components/grid'
import Form from '../../../components/form'
import Input from '../../../components/input'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const prefix = 'progress-type'
const desc = '有足够的空间，突出展示进度状态'
const code = `import React from 'react'
import { Form, Grid, Radio, Button, Input, Timeline, Progress } from '@hi-ui/hiui'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      typeList: [
        {
          id: 'large',
          content: '大号'
        },
        {
          id: 'default',
          content: '中号'
        },
        {
          id: 'small',
          content: '小号'
        }
      ],
      size: 'large'
    }
  }
  render() {
    const { size } = this.state
    const FormItem = Form.Item
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
        <Row gutter>
          <Col span={12}>
            <Radio.Group
              type='button'
              data={this.state.typeList}
              value={this.state.size}
              onChange={(data) => {
                this.setState({
                  size: data
                })
              }}
            />
          </Col>
        </Row>
        <Row gutter>
          <Col span={12}>
            <Progress percent={10} size={size}/>
            <br/>
            <Progress type='success' content='成功' percent={40} size={size}/>
            <br/>
            <Progress type='warn' content='错误' percent={50} size={size}/>
            <br/>
            <Progress type='error' content='警示' percent={100} size={size}/>
          </Col>
        </Row>
      </div>
    )
  }
}`

const DemoType = () => <DocViewer code={code} scope={{ Progress, Form, Radio, Grid, Input, Button }} prefix={prefix} desc={desc} />
export default DemoType
