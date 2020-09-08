import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-fast-check'
const rightOptions = ['内置', '自定义选择范围']
const desc = '将常用的日期或时间提炼成快捷项，节省操作成本'
const code = [{
  code: `import React from 'react'
  import DatePicker from '@hi-ui/hiui/es/date-picker'\n
  class Demo extends React.Component {
    render () {
      return (
        <DatePicker
          type='daterange'
          shortcuts={['近一周','近一月','近三月','近一年']}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      )
    }
  }`,
  opt: ['内置']
}, {
  code: `import React from 'react'
  import DatePicker from '@hi-ui/hiui/es/date-picker'\n
  class Demo extends React.Component {
    render () {
      return (
        <DatePicker
          type='daterange'
          shortcuts={[{
            title: '近十天',
            range: [new Date().getTime() - 10 * 86400000, new Date()]
          }, {
            title: '近二十天',
            range: [new Date().getTime() - 20 * 86400000, new Date()]
          }, {
            title: '近三十天',
            range: [new Date().getTime() - 30 * 86400000, new Date()]
          }]}
          onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
        />
      )
    }
  }`,
  opt: ['自定义选择范围']
}]

const DemoFastCheck = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoFastCheck
