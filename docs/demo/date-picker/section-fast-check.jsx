import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-fast-check'
const code = `
import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        type='daterange'
        shortcuts={['近一周','近一月','近三月','近一年']}
        onChange={(d) => {console.log(d)}}
      />
    )
  }
}`

const DemoFastCheck = () => <DocViewer code={code} scope={{ DatePicker }} prefix={prefix} />
export default DemoFastCheck
