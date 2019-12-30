import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Collapse from '../../../components/collapse'
const prefix = 'section-basic'
const rightOptions = []
const desc = '可以同时展开多个面板，对垂直空间没有特别限制'
const code = [
  {
    code: `import React from 'react'
import Checkbox from '@hi-ui/hiui/es/checkbox'\n
class Demo extends React.Component {
  render(){
    return(
      <Collapse
        onChange={()=>{console.log('切换了！');}}
        arrow="right"
      >
        <Collapse.Panel
          disabled={true}
          header="panel title 1"
        >
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 2"
        >
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
        </Collapse.Panel>
        <Collapse.Panel
          header="panel title 3"
        >
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
        </Collapse.Panel>
      </Collapse>
    )
  }
}`,
    opt: []
  }
]

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Collapse }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc={desc}
  />
)
export default DemoBasic
