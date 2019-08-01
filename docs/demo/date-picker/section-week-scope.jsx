import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-week-scope'
const code = `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        value={{start: new Date(), end: new Date().getTime() + 7 * 24 * 60*60*1000}}
        type='weekrange'
        onChange={(d) => {
          console.log(d)
        }}
      />
    )
  }
}`

const DemoWeekScope = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
  />
)
export default DemoWeekScope
