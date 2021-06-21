import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTree from '../../../components/select-tree'
const prefix = 'tree-select-filter'
const rightOptions = ['高亮显示', '实时过滤']
const desc = '通过搜索框定位目标数据'
const defaultStr = `constructor () {
  super()
  this.state = {
    value: '3',
    singleList: [
      {
        title: '手机类',
        id: '0',
        children: [
          {
            title: 'Redmi系列',
            id: '0-0',
            children: [{
              id: '0-0-1',
              title: 'Redmi K30'
            }, {
              id: '0-0-2',
              title: 'Redmi K30 Pro'
            }, {
              id: '0-0-3',
              title: 'Redmi 10X 5G'
            }, {
              id: '0-0-4',
              title: 'Redmi Note 8'
            }, {
              id: '0-0-5',
              title: 'Redmi 9'
            }, {
              id: '0-0-6',
              title: 'Redmi 9A'
            }]
          },{
            title: '小米手机',
            id: '0-1',
            children: [{
              id: '0-1-1',
              title: '小米10 Pro'
            }, {
              id: '0-1-2',
              title: '小米10'
            }, {
              id: '0-1-3',
              title: '小米10 青春版 5G'
            }, {
              id: '0-1-4',
              title: '小米MIX Alpha'
            }]
          },
        ]
      },
      {
        title: '电视',
        id: '1',
        children: [{
          title: '小米电视 大师 65英寸OLED',
          id: '1-0'
        }, {
          title: 'Redmi 智能电视 MAX 98',
          id: '1-1'
        }, {
          title: '小米电视4A 60英寸',
          id: '1-2'
        }]
      }
    ]
  }
}`
const code = [
  {
    code: `import React from 'react'
import SelectTree from '@hi-ui/hiui/es/select-tree'\n
class Demo extends React.Component {
  ${defaultStr}

  render () {
    return (
      <SelectTree
        searchMode='highlight'
        type='multiple'
        data={this.state.singleList}
      />
    )
  }
}`,
    opt: ['高亮显示']
  },
  {
    code: `import React from 'react'
    import SelectTree from '@hi-ui/hiui/es/select-tree'\n
    class Demo extends React.Component {
      ${defaultStr}

      render () {
        const { singleList } = this.state
        return (
          <SelectTree
            searchMode='filter'
            type='multiple'
            data={singleList}
          />
        )
      }
    }`,
    opt: ['实时过滤']
  }
]
const DemoType = () => (
  <DocViewer code={code} scope={{ SelectTree }} prefix={prefix} rightOptions={rightOptions} desc={desc} />
)
export default DemoType
