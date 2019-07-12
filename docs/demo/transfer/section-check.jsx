import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Transfer from '../../../components/transfer'
const prefix = 'transfer-check'

const code = `
import React from 'react'
import Transfer from '@hi-ui/hiui/es/transfer'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      datas: this.randomDatas(),
      targetKeys: [2, 3]
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
        targetKeys={this.state.targetKeys}
        data={this.state.datas}
        onChange={this.onChange.bind(this)}
      />
    )
  }
}`
const DemoCheck = () => <DocViewer code={code} scope={{ Transfer }} prefix={prefix} />
export default DemoCheck
