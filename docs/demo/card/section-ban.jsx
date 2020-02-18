import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
const prefix = 'card-ban'
const desc = '禁用卡片'
const code = `import React from 'react'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
        <Card
          hoverable
          coverUrl='http://i1.mifile.cn/f/i/hiui/docs/card/pic_9.png'
          title='图片展示'
          content='这里是正文，这里是正文'
          size='small'
          disabled= 'false'
        ></Card>
    )
  }
}`
const DemoImage = () => <DocViewer code={code} scope={{ Card }} prefix={prefix} desc={desc} />
export default DemoImage
