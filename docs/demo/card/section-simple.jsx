import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
const prefix = 'card-simple'
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
const DemoSimple = () => <DocViewer code={code} scope={{ Card }} prefix={prefix} />
export default DemoSimple
