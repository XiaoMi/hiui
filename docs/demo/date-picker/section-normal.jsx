import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-normal'
const desc = '以天为粒度，展示“YYYY-MM-DD”'
const rightOptions = ['基础', '带默认值', '禁用', '限制范围']
const code = [
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
      />
    )
  }
}`,
    opt: ['基础']
  },
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        value={new Date()}
        onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
      />
    )
  }
}`,
    opt: ['带默认值']
  },
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        disabled
        onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
      />
    )
  }
}`,
    opt: ['禁用']
  },
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <DatePicker
        min={new Date()}
        max={new Date().getTime() + 30 * 24 * 60 * 60 * 1000}
        onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
      />
    )
  }
}`,
    opt: ['限制范围']
  }
]
const DemoNormal = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoNormal
