import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Select from '../../../components/select'
import Input from '../../../components/input'
import Button from '../../../components/button'
const prefix = 'select-custom'
const desc = ['选项结构：可自定义选项的信息结构或样式', '搜索条件：可自定义搜索条件的算法']
const rightOptions = ['选项结构', '搜索条件']

const code = [
  {
    code: `import React from 'react'
import Select from '@hi-ui/hiui/es/select'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      singleList: [
        { title:'平板', id:'1' },
        { title:'较长的一段描述文本', id:'2' },
        { title:'手机', id:'3' },
        { title:'笔记本', id:'4', disabled: true },
        { title:'生活周边', id:'5' },
        { title:'生态链', id:'6' },
      ]
    }
  }

  render () {
    return (
      <Select
        placeholder='请选择'
        style={{ width: 200 }}
        defaultValue={3}
        data={this.state.singleList}
        searchable
        onChange={(item) => {
          console.log('单选结果', item)
        }}
        renderExtraFooter={()=>{
          return <div style={{width: '100%'}}>
            <Input style={{width: '100px'}}/>
            <Button type="line" appearance="link" icon="plus">新增</Button>
          </div>
        }}
        render={(item, isSelected) => {
          return (
            <React.Fragment>
              <span style={{ float: 'left' }}>{item.title}</span>
              <span style={{ float: 'right', color: '#999', fontSize: 14}}>{item.id}</span>
            </React.Fragment>
          )
        }}
      />
    )
  }
}`,
    opt: ['选项结构']
  },
  {
    code: `import React from 'react'
    import Select from '@hi-ui/hiui/es/select'\n
    class Demo extends React.Component {
      constructor () {
        super()
        this.state = {
          singleList: [
            { title: '小米1', id: 1 },
            { title: '小米2', id: 2, disabled: true },
            { title: '小米3', id: 3, disabled: true },
            { title: '小米4', id: 4 },
            { title: '小米5', id: 5 },
            { title: '小米6', id: 6 },
            { title: '小米8', id: 8 },
            { title: '小米9', id: 9 },
          ]
        }
      }
    
      render () {
        return (
          <Select
            type='single'
            data={this.state.singleList}
            placeholder='请选择'
            style={{ width: 200 }}
            onChange={(item) => {
              console.log('单选结果', item)
            }}
            searchable
            filterOption={(keyword, item) => {
              keyword = parseInt(keyword)
              return item.id >= keyword
            }}
          />
        )
      }
    }`,
    opt: ['搜索条件']
  }
]
const DemoCustom = () => (
  <DocViewer code={code} scope={{ Select, Button, Input }} prefix={prefix} desc={desc} rightOptions={rightOptions} />
)
export default DemoCustom
