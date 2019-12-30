import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
const prefix = 'card-simple'
const desc = '仅显示名称的卡片，用在筛选项、属性、指标等管理和展示场景'
const code = `import React from 'react'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Card
            hoverable
            type='simple'
            size='small'
          >
            简易卡片
          </Card>
          <br/>
         <Card
            hoverable
            type='simple'
            size='default'
          >
            简易卡片
          </Card>

          <br/>
          <Card
            hoverable
            type='simple'
          >
            简易卡片
          </Card>
      </React.Fragment>
    )
  }
}`
const DemoSimple = () => <DocViewer code={code} scope={{ Card }} prefix={prefix} desc={desc} />
export default DemoSimple
