import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
const prefix = 'radio-vertical'
const desc = '选项的另一种布局形式，视页面空间选用'
const code = `import React from 'react'
import Radio from '@hi-ui/hiui/es/radio'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.list = [{
      id: 0,
      content: '手机类'
    }, {
      id: 1,
      content: '电脑类'
    }, {
      id: 2,
      content: '生活类'
    }]
  }
  render() {
    return (
        <Radio.Group
          placement='vertical'
          data={this.list}
          defaultValue={0}
          onChange={(data) => console.log(data)}
        />
    )
  }
}`
const DemoVertical = () => (
  <DocViewer
    code={code}
    scope={{ Radio }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoVertical
