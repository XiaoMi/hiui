import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Transfer from '../../../components/transfer'
const prefix = 'transfer-batch'
const code = `
import React from 'react'
import Transfer from '@hiui/hiui/es/transfer'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      datas: this.randomDatas(),
      targetKeys: [],
      disabled: false
    }
  }
  randomDatas () {
    const arr = []
    for (let i=1;i<16; i++) {
      arr.push({
        id: i,
        content: '选项'+i,
        disabled: i%3 === 0
      })
    }
    return arr
  }
  onChange (movedKeys) {
    this.setState({
      targetKeys: movedKeys,
      disabled: movedKeys.length > 5
    })
  }
  render () {
    return (
      <div>
        <Transfer
          mode='multiple'
          title={['批量']}
          disabled={this.state.disabled}
          targetKeys={this.state.targetKeys}
          data={this.state.datas}
          onChange={this.onChange.bind(this)}
        />
      </div>
    )
  }
}`
const DemoBatch = () => (
  <DocViewer
    code={code}
    scope={{ Transfer }}
    prefix={prefix}
  />
)
export default DemoBatch
