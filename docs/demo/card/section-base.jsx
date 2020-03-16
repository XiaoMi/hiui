import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
const prefix = 'card-base'
const rightOptions = ['基础', '无标题', '悬浮效果']
const desc =
  '用卡片封装独立的信息实体，如模块、功能、项目、应用等，或还原实际生活中的卡片应用'
const code = [
  {
    code: `import React from 'react'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <Card title="标题" size='default' >
        <p>基础卡片</p>
      </Card>
    )
  }
}`,
    opt: ['基础']
  },
  {
    code: `import React from 'react'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <Card size='default' >
        <p>无标题卡片</p>
      </Card>
    )
  }
}`,
    opt: ['无标题']
  },
  {
    code: `import React from 'react'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <Card title="标题" hoverable size='default' >
        <p>鼠标移入悬浮效果</p>
      </Card>
    )
  }
}`,
    opt: ['悬浮效果']
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Card }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoBase
