import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'section-format'
const desc = '可自定义不同的时间粒度'
const rightOptions = ['时分秒', '时分', '时']
const code = [
  {
    code: `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <TimePicker
          defaultValue={new Date()}
          format="HH:mm:ss"
          onChange={(date, dateString) => console.log(date, dateString)}
        />
    )
  }
}`,
    opt: ['时分秒']
  },
  {
    code: `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <TimePicker
          defaultValue={new Date()}
          format="HH:mm"
          onChange={(date, dateString) => console.log(date, dateString)}
        />
    )
  }
}`,
    opt: ['时分']
  },
  {
    code: `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <TimePicker
          defaultValue={new Date()}
          format="HH"
          onChange={(date, dateString) => console.log(date, dateString)}
        />
    )
  }
}`,
    opt: ['时']
  }
]
const DemoBase = () => (
  <DocViewer
    code={code}
    desc={desc}
    scope={{ TimePicker }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoBase
