import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-year'
const desc = '以年为粒度，展示“YYYY”'
const code = `import React from 'react'
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
}`
const DemoYear = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoYear
