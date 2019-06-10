import Card from '../../../../components/card'
import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
const prefix = 'card-basic'
const desc = '基础卡片用法'
const leftOptions = ['基础', '无标题', '无内容', '禁用']
const rightOptions = ['S', 'M', 'L']
const code = [
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card title='标题' size='small'>
        <span>普通 Card</span>
      </Card>
    )
  }
}`,
    opt: ['基础', 'S']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card title='标题' size='middle'>
        <span>普通 Card</span>
      </Card>
    )
  }
}`,
    opt: ['基础', 'M']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card title='标题' size='large'>
        <span>普通 Card</span>
      </Card>
    )
  }
}`,
    opt: ['基础', 'L']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable size='small'>
        <p>无标题</p>
        <p>鼠标移入悬浮效果</p>
        <p>其它额外内容</p>
      </Card>
    )
  }
}`,
    opt: ['无标题', 'S']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable size='middle'>
        <p>无标题</p>
        <p>鼠标移入悬浮效果</p>
        <p>其它额外内容</p>
      </Card>
    )
  }
}`,
    opt: ['无标题', 'M']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable size='large'>
        <p>无标题</p>
        <p>鼠标移入悬浮效果</p>
        <p>其它额外内容</p>
      </Card>
    )
  }
}`,
    opt: ['无标题', 'L']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable disabled title='标题' size='small'>
        <p>禁用状态</p>
      </Card>
    )
  }
}`,
    opt: ['无内容', 'S']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable disabled title='标题' size='middle'>
        <p>禁用状态</p>
      </Card>
    )
  }
}`,
    opt: ['无内容', 'M']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable disabled title='标题' size='large'>
        <p>禁用状态</p>
      </Card>
    )
  }
}`,
    opt: ['无内容', 'L']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable disabled size='small'>
        无标题,禁用状态
      </Card>
    )
  }
}`,
    opt: ['禁用', 'S']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable disabled size='middle'>
        无标题,禁用状态
      </Card>
    )
  }
}`,
    opt: ['禁用', 'M']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card hoverable disabled size='large'>
        无标题,禁用状态
      </Card>
    )
  }
}`,
    opt: ['禁用', 'L']
  }
]

const Demo = () => (
  <DocViewer
    code={code}
    scope={{ Card }}
    desc={desc}
    leftOptions={leftOptions}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default Demo
