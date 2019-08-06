import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
import Grid from '../../../components/grid'
const prefix = 'date-picker-week'
const code = `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
       <Row gutter={true}>
          <Col span={6}>
            <p>周一起始</p>
            <DatePicker
              type='week'
              weekOffset={1}
              onChange={(d) => {
                console.log('周选择', d)
              }}
            />
          </Col>
          <Col span={6}>
            <p>周日起始</p>
            <DatePicker
              type='week'
              onChange={(d) => {
                console.log('周选择', d)
              }}
            />
          </Col>
        </Row>
      </div>
    )
  }
}`
const DemoWeek = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker, Grid }}
    prefix={prefix}
  />
)
export default DemoWeek
