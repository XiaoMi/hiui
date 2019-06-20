import React from 'react'
import DocViewer from '../../../../libs/doc-viewer'
import Transfer from '../../../../components/transfer'
const prefix = 'transfer-count'
const code = `
import React from 'react'
import Transfer from '@hiui/hiui/es/transfer'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      datas: this.randomDatas(),
      targetKeys: []
    }
  }
  randomDatas () {
    const arr = []
    for (let i=1;i<16; i++) {
      arr.push({
        id: i,
        content: '选项'+i
      })
    }
    return arr
  }
  onChange (movedKeys) {
    this.setState({
      targetKeys: movedKeys
    })
  }
  render () {
    return (
      <Transfer 
        mode='multiple'
        showAllSelect
        targetLimit={4}
        targetKeys={this.state.targetKeys}
        data={this.state.datas}
        onChange={this.onChange.bind(this)}
      />
    )
  }
}`

const DemoCount = () => (
  <DocViewer
    code={code}
    scope={{ Transfer }}
    prefix={prefix}
  />
)
export default DemoCount
