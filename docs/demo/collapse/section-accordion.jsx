import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Collapse from '../../../components/collapse'
const prefix = 'section-accordion'
const rightOptions = []
const desc = '一次仅展开一个面板，有效减少垂直空间的占用'
const code = [
  {
    code: `import React from 'react'
import Collapse from '@hi-ui/hiui/es/collapse'\n
class Demo extends React.Component {
  render(){
    return(
      <Collapse
        onChange={()=>{console.log('切换了！');}}
        accordion={true}
        arrowPlacement="right"
      >
        <Collapse.Panel
          disabled={true}
          title="panel title 1"
        >
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel
          title="panel title 2"
        >
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
        </Collapse.Panel>
        <Collapse.Panel
          title="panel title 3"
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
  <DocViewer code={code} scope={{ Collapse }} prefix={prefix} rightOptions={rightOptions} desc={desc} />
)
export default DemoBasic
