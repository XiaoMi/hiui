import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Button from '../../../components/button'
import Modal from '../../../components/modal'
import DatePicker from '../../../components/date-picker'
import Select from '../../../components/select'
const prefix = 'modal-base'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Modal from '@hi-ui/hiui/es/modal'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.textInput = React.createRef();
    this.state = {
      visible: false,
      data:[
        { title:'电视', id:'3', disabled: true },
        { title:'手机', id:'2' },
        { title:'笔记本', id:'4', disabled: true },
        { title:'生活周边', id:'5' },
        { title:'办公', id:'6' },
      ]
    }
  }
  cancelEvent () {
    this.setState({
      visible: false
    })
    console.log("自定义关闭事件")
  }
  render(){
    return(
      <div>
        <Button type="primary" onClick={() => this.setState({visible: true})}>打开</Button>
        <Modal
          title="提示消息"
          contains = {this.textInput}
          visible={this.state.visible}
          onConfirm={this.cancelEvent.bind(this)}
          onCancel={this.cancelEvent.bind(this)}
        >
        <div style={{height: '200px',overflow:'auto'}} ref={this.textInput}>
            <span>一些消息....</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <Select
              type='single'
              clearable={false}
              style={{ width: 200 }}
              data={this.state.data}
            />
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <div style={{display:'flex', flexWrap: 'wrap'}}>
            <Select
            type='single'
            clearable={false}
            style={{ width: 200 }}
            data={this.state.data}
          />
            </div>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
            <span>一些消息...</span><br/>
        </div>
          
        </Modal>
      </div>
    )
  }
}`

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Button, Modal, Select, DatePicker }}
    prefix={prefix}
  />
)
export default DemoBase
