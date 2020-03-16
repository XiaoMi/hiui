import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
const prefix = 'button-link'
const rightOptions = ['文本链接', '带图标链接']
const desc = [
  '文本链接：执行操作时发出页面请求，页面会给予明确的反馈',
  '带图标链接：强调动作含义或简化动作的操作区域'
]
const code = [
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="primary" appearance="link">编辑</Button>
        <Button type="default" appearance="link">查看更多</Button>
        <Button type="success" appearance="link">复制链接到微信</Button>
        <Button type="danger" appearance="link">删除</Button>
      </React.Fragment>
    )
  }
}`,
    opt: ['文本链接']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'\n
class Demo extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Button type="line" appearance="link" icon="edit" />
        <Button type="line" appearance="link" icon="down">展开更多</Button>
        <Button type="line" appearance="link" icon="plus">新增筛选项</Button>
      </React.Fragment>
    )
  }
}`,
    opt: ['带图标链接']
  }
]

const DemoLink = () => (
  <DocViewer
    code={code}
    scope={{ Button }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc={desc}
  />
)
export default DemoLink
