import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
import Grid from '../../../components/grid'
const prefix = 'date-picker-week'
const desc = '以年份 / 月份 / 周为展示粒度'
const rightOptions = ['年份', '月份', '周']
const code = [
  {
    code: `import React from 'react'
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
              onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
            />
          </Col>
          <Col span={6}>
            <p>周日起始</p>
            <DatePicker
              type='week'
              onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
            />
          </Col>
        </Row>
      </div>
    )
  }
}`,
    opt: ['周']
  },
  {
    code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <DatePicker
          type='month'
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
    )
  }
}`,
    opt: ['月份']
  },
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        type='year'
        onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
      />
    )
  }
}`,
    opt: ['年份']
  }
]
const DemoWeek = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker, Grid }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoWeek
