import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Badge from '../../../components/badge'
import Button from '../../../components/button'
const prefix = 'badge-normal'
const desc = '标识消息数或简洁描述'
const rightOptions = ['基础', '显示上限', '自定义']
const code = [
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Badge from '@hi-ui/hiui/es/badge'\n
class Demo extends React.Component {
  render () {
    return (
      <Badge content={8}>
        <Button type='default'>最新报表</Button>
      </Badge>
    )
  }
}`,
    opt: ['基础']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Badge from '@hi-ui/hiui/es/badge'\n
class Demo extends React.Component {
  render () {
    return (
      <Badge content={88} max={44}>
        <Button type='default'>最新报表</Button>
      </Badge>
    )
  }
}`,
    opt: ['显示上限']
  },
  {
    code: `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Badge from '@hi-ui/hiui/es/badge'\n
class Demo extends React.Component {
  render () {
    return (
      <Badge content="new">
        <Button type='default'>最新报表</Button>
      </Badge>
    )
  }
}`,
    opt: ['自定义']
  }
]

const DemoNormal = () => (
  <DocViewer
    code={code}
    scope={{ Badge, Button }}
    rightOptions={rightOptions}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoNormal
