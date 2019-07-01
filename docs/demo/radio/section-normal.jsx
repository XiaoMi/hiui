import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Radio from '../../../components/radio'
import Button from '../../../components/button'
const prefix = 'radio-noraml'
const code = `
import React from 'react'
import Button from '@hiui/hiui/es/button'
import Radio from '@hiui/hiui/es/radio'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      checked: 2,
      play : [{
        name: '手机',
        id: 101
      }, {
        name: '电视',
        id: 102
      }],
      product: [{
        name: '红米手机',
        id: 1,
        checked: true
      }, {
        name: '小米 MIX3',
        id: 2
      }, {
        name: '扫地机器人',
        id: 3,
        checked: true
      }, {
        name: '新风机',
        id: 4
      }],
      type: [{
        id: 1001,
        name: '电子产品'
      }, {
        id: 1002,
        name: '办公用品'
      }, {
        id: 1003,
        name: '家居用品'
      }]
    }
  }
  render() {
    return (
      <div>
          <p>简单数据 (通过数据索引设置默认选中)</p>
          <Radio
            list={['北京', '上海', '重庆']}
            checked={this.state.checked}
            onChange={(data)=>{
              console.log(data)
            }}
          />
          <Button type='default' onClick={() => {this.setState({checked: 0})}}>点击</Button>
          <p>复杂数据结构 (通过数据索引设置默认选中)</p>
          <Radio
            list={this.state.play}
            onChange={(data)=>{
              console.log(data)
            }}
            checked={1}
            disabled={1}
          />
          <p>复杂数据结构 (通过列表项设置选中)</p>
          <Radio
            list={this.state.product}
            onChange={(data)=>{
              console.log(data)
            }}
            disabled={(item) => item.id === 1 || item.id === 3}
          />
          <p>复杂数据结构 (通过函数确定选中项)</p>
          <Radio
            list={this.state.type}
            onChange={(data)=>{
              console.log(data)
            }}
            checked={(item) => item.id === 1002}
          />
          <p>垂直布局</p>
            <Radio
              list={['春', '夏', '秋']}
              layout='vertical'
            />
            <br/>
      </div>
    )
  }
}`

const DemoNormal = () => <DocViewer code={code} scope={{ Radio, Button }} prefix={prefix} />
export default DemoNormal
