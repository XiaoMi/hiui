import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
const prefix = 'date-picker-normal'
const desc = '以天为粒度，展示“YYYY-MM-DD”'
const rightOptions = ['基础', '带默认值', '受控', '禁用', '限制范围']
const code = [
  {
    code: `import React from 'react'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  render () {
    return (
      <div>
      <DatePicker
        onChange={(date, dateStr) => {console.log('onChange', date, dateStr)}}
      />
      </div>
      
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
        defaultValue={new Date()}
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
  constructor() {
    super()
    this.state={
      value: new Date()
    }
  }
  render () {
    return (
      <DatePicker
        value={this.state.value}
        onChange={(date, dateStr) => {
          console.log('onChange', date, dateStr)
          this.setState({value: dateStr})
      }}
      />
    )
  }
}`,
    opt: ['受控']
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
  <DocViewer code={code} scope={{ DatePicker, Radio }} prefix={prefix} desc={desc} rightOptions={rightOptions} />
)
export default DemoNormal
