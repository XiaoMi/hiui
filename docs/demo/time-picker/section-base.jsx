import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import TimePicker from '../../../components/date-picker/TimePicker'
const prefix = 'section-base'
const rightOptions = ['基础', '步长设置', '禁用']
const desc = '选择时间点，可与日期搭配使用，也可用于展示当天时间'
const code = [
  {
    code: `import React from 'react'
    import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
    class Demo extends React.Component {
      render() {
        return (
          <TimePicker
            defaultValue={new Date()}
            onChange={(date, dateString) => console.log(date, dateString)}
          />
        )
      }
    }`,
    opt: ['基础']
  },
  {
    code: `import React from 'react'
    import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
    class Demo extends React.Component {
      render() {
        return (
          <TimePicker
            hourStep={5}
            minuteStep={6}
            secondStep={10}
            onChange={(date, dateString) => console.log(date, dateString)}
          />
        )
      }
    }`,
    opt: ['步长设置']
  },
  {
    code: `import React from 'react'
import TimePicker from '@hi-ui/hiui/es/date-picker/TimePicker'\n
class Demo extends React.Component {
  render() {
    return (
      <TimePicker
        disabled
        onChange={(date, dateString) => console.log('时间', date, dateString)}
      />
    )
  }
}`,
    opt: ['禁用']
  }
]
const DemoBase = () => (
  <DocViewer code={code} scope={{ TimePicker }} prefix={prefix} desc={desc} rightOptions={rightOptions} />
)
export default DemoBase
