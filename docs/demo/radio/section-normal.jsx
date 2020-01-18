import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
const prefix = 'radio-type'
const desc = '展示所有备选项，数量不宜超出10个'
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
    }, {
      id: 3,
      content: '其它'
    }, {
      id: 4,
      content: '禁用未选',
      disabled: true
    }]
  }
  render() {
    return (
      <div>
        <Radio.Group
          data={this.list}
          defaultValue={0}
          onChange={(data) => console.log(data)}
        />
        <Radio
          checked={true}
          disabled={true}
        >
          禁用已选
        </Radio>
      </div>

    )
  }
}`
const DemoType = () => (
  <DocViewer
    code={code}
    scope={{ Radio }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoType
