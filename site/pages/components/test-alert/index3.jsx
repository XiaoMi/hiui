import Card from '../../../../components/card'
import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
const desc =
  '当模块是界面的主体信息且可通过图片来表达含义时适用，可增加描述的生动性，提高模块辨识度。常用于应用、功能入口、任务、项目、计划等。'
const leftOptions = ['居左', '居中', '仅标题', '禁用']
const code = [
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card
        hoverable
        cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
        title='图片展示'
        description='图片信息描述：size=small;width:276px'
        size='small'
      />
    )
  }
}`,
    opt: ['居左']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card
        hoverable
        cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
        title='图片展示'
        description='图片信息描述：size=middle;width:376px'
        size='middle'
      />
    )
  }
}`,
    opt: ['居中']
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
    opt: ['仅标题']
  },
  {
    code: `import Card from '@hiui/hiui/es/card'
import React from 'react'\n
class Demo extends React.Component {
  render () {
    return (
      <Card
        hoverable
        cover={<img src='https://i.loli.net/2019/04/18/5cb82488403de.png'/>}
        title='图片展示'
        description='图片信息描述：size=large;width:576px'
        size='large'
      />
    )
  }
}`,
    opt: ['禁用']
  }
]

const Demo = () => <DocViewer code={code} scope={{ Card }} desc={desc} leftOptions={leftOptions} />
export default Demo
