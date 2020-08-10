import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Collapse from '../../../components/collapse'
const prefix = 'section-basic'
const rightOptions = ['基础用法', '默认展开', '受控']
const desc = '可以同时展开多个面板，对垂直空间没有特别限制'
const code = [
  {
    code: `import React from 'react'
import Collapse from '@hi-ui/hiui/es/collapse'\n
class Demo extends React.Component {
  render(){
    return(
      <Collapse
        onChange={(id)=>{console.log('切换了！',id);}}
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
    opt: ['基础用法']
  },
  {
    code: `import React from 'react'
import Collapse from '@hi-ui/hiui/es/collapse'\n
class Demo extends React.Component {
  constructor(props){
    super(props)
    this.state={
      defaultActiveId:['2']
    }
  }
  render(){
    const {defaultActiveId} = this.state
    return(
      <Collapse
        onChange={(activeId)=>{
          console.log('切换了！',activeId);
        }}
        defaultActiveId={defaultActiveId}
        arrowPlacement="right"
      >
        <Collapse.Panel
          id='1'
          title="panel title 1"
        >
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel
          title="panel title 2"
          id='2'
        >
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
        </Collapse.Panel>
        <Collapse.Panel
          title="panel title 3"
          id='3'
        >
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
        </Collapse.Panel>
      </Collapse>
    )
  }
}`,
    opt: ['默认展开']
  },
  {
    code: `import React from 'react'
import Collapse from '@hi-ui/hiui/es/collapse'\n
class Demo extends React.Component {
  constructor(props){
    super(props)
    this.state={
      activeId:['1']
    }
  }
  render(){
    const {activeId} = this.state
    return(
      <Collapse
        onChange={(activeId)=>{
          console.log('切换了！',activeId);
          this.setState({
            activeId:activeId
          })
        }}
        activeId={activeId}
        arrowPlacement="right"
      >
        <Collapse.Panel
          id='1'
          title="panel title 1"
        >
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
          <p>Collapse Panel Content 1</p>
        </Collapse.Panel>
        <Collapse.Panel
          title="panel title 2"
          id='2'
        >
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
          <p>Collapse Panel Content 2</p>
        </Collapse.Panel>
        <Collapse.Panel
          title="panel title 3"
          id='3'
        >
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
          <p>Collapse Panel Content 3</p>
        </Collapse.Panel>
      </Collapse>
    )
  }
}`,
    opt: ['受控']
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
