import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Transfer from '../../../components/transfer'
const prefix = 'transfer-area'
const desc = '可通过拖拽的形式对目标区域内进行排序'
const rightOptions = ['基础用法', '高级用法']
const code = [
  {
    code: `import React from 'react'
  import Transfer from '@hi-ui/hiui/es/transfer'\n
  class Demo extends React.Component {
    constructor () {
      super()
      this.state = {
        datas: this.randomDatas(),
        targetIds: [2, 3, 4, 6, 9]
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
      console.log(movedKeys)
      this.setState({
        targetIds: movedKeys
      })
    }
    render () {
      return (
        <Transfer
          type='multiple'
          showCheckAll
          draggable
          targetIds={this.state.targetIds}
          data={this.state.datas}
          onChange={this.onChange.bind(this)}
        />
      )
    }
  }`,
    opt: ['基础用法']
  },
  {
    code: `import React from 'react'
  import Transfer from '@hi-ui/hiui/es/transfer'\n
  class Demo extends React.Component {
    constructor () {
      super()
      this.state = {
        datas: this.randomDatas(),
        targetIds: [2, 3, 4, 6, 9]
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
      console.log(movedKeys)
      this.setState({
        targetIds: movedKeys
      })
    }
    render () {
      return (
        <Transfer
          type='multiple'
          showCheckAll
          draggable
          onDragEnd={newData => {
            console.log(newData)
          }}
          onDragStart={item => {
            return item.id !== 3
          }}
          onDrop={(targetItem, sourceItem) => {
            return targetItem.id > sourceItem.id
          }}
          targetIds={this.state.targetIds}
          data={this.state.datas}
          onChange={this.onChange.bind(this)}
        />
      )
    }
  }`,
    opt: ['高级用法']
  }
]
const DemoArea = () => (
  <DocViewer code={code} scope={{ Transfer }} prefix={prefix} rightOptions={rightOptions} desc={desc} />
)
export default DemoArea
