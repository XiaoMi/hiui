import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import DatePicker from '../../../components/date-picker'
import Modal from '../../../components/modal'
import Button from '../../../components/button'
const prefix = 'date-picker-modal'
const code = `
import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Modal from '@hi-ui/hiui/es/modal'
import DatePicker from '@hi-ui/hiui/es/date-picker'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      show: false,
      date: new Date(),
      rangeDate: {start: new Date(), end: new Date()}
    }
  }
  cancelEvent () {
    this.setState({
      show: false
    })
    console.log("自定义关闭事件")
  }
  render () {
    return (
      <div style={{width:'100%'}}>
        <Button type="primary" onClick={() => this.setState({show: true})}>在 Modal 中打开</Button>
       {
          this.state.show && <Modal
          title="提示消息"
          show={this.state.show}
          backDrop={true}
          onConfirm={()=>{console.log('自定义确定事件')}}
          onCancel={this.cancelEvent.bind(this)}
        >
          <DatePicker
            value={this.state.date}
            onChange={(d) => {
              console.log(DatePicker.format(d, 'YYYY-MM E'))
            }}
          />
          <DatePicker
            type='daterange'
            value={this.state.rangeDate}
            onChange={(d) => {
              console.log(d)
            }}
          />
        </Modal>
       }
      </div>
    )
  }
}`

const DemoModal = () => (
  <DocViewer
    code={code}
    scope={{ DatePicker, Button, Modal }}
    prefix={prefix}
  />
)
export default DemoModal
