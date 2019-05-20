import Card from '../../../../components/card'
import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
const desc = '基础卡片用法'
const leftOptions = ['基础', '无标题', '无内容', '禁用']
const code = [
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card title='标题'>
        <span>普通 Card</span>
      </Card>
    )
  }
}`,
    opt: ['基础']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable>
        <p>无标题</p>
        <p>鼠标移入悬浮效果</p>
        <p>其它额外内容</p>
      </Card>
    )
  }
}`,
    opt: ['无标题']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable size='large' disabled title='标题'>
        <p>禁用状态</p>
      </Card>
    )
  }
}`,
    opt: ['无内容']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable size='large' disabled>
        无标题,禁用状态
      </Card>
    )
  }
}`,
    opt: ['禁用']
  }
]

const Demo = () => <DocViewer code={code} scope={{ Card }} desc={desc} leftOptions={leftOptions} />
export default Demo
