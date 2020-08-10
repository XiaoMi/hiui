import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import List, { IconText } from '../../../components/list'
import Radio from '../../../components/radio'
const prefix = 'list-flow'
const desc = '常用在搜索、动态发布信息流、附件等场景'
const rightOptions = ['基础用法', '带有分页']

const code = [
  {
    code: `import React from 'react'
    import List,{ IconText } from '@hi-ui/hiui/es/list'\n
    import Radio from '@hi-ui/hiui/es/radio'
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          actionPosition:'bottom',
          data: [
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
      
            },
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
            },
          ],
          list:[{
            id: 'top',
            content: '居上'
          }, {
            id: 'center',
            content: '居中',
          }, {
            id: 'bottom',
            content: '居下'
          }]
        }

      }
      render () {
        const {data,actionPosition,list} = this.state
        return (
          <div>
          <span>操作位置: </span>
          <Radio.Group
            data={list}
            type='button'
            defaultValue={'bottom'}
            onChange={(data) => {
              this.setState({
                actionPosition:data
              })
            }}
          />
            <List
            data={data}
            key='12'
            actionPosition={actionPosition}
            renderItem={dataItem => {
              const { Item } = List
              return <Item {...dataItem} />
            }}
            action={dataItem => {
              return (
                <div style={{ height: '100%' }}>
                  <IconText name='star' text='123' />
                  <IconText
                    name='like'
                    text='8'
                    style={{ marginLeft: '24px' }}
                  />
                  <IconText name='step-on' style={{ marginLeft: '24px' }} />
                </div>
              )
            }}
          />
          </div>
          
        )
      }
    }`,
    opt: ['基础用法']
  },
  {
    code: `import React from 'react'
    import List,{ IconText } from '@hi-ui/hiui/es/list'\n
    import Radio from '@hi-ui/hiui/es/radio'

    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          position:'right',
          data: [
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
      
            },
            {
              title: '下单量-指标',
              description: '下单量在交易环节中整体用户下单的数量',
              extra: '最新使用：2019.12.23 下午07:07',
            },
          ],
          list:[{
            id: 'left',
            content: '居左'
          }, {
            id: 'middle',
            content: '居中',
          }, {
            id: 'right',
            content: '居右'
          }]
        }
      }
      render () {
        const {data,list,position} = this.state
        return (
          <div>
          <span>分页位置: </span>
          <Radio.Group
            data={list}
            type='button'
            defaultValue={'right'}
            onChange={(data) => {
              this.setState({
                position:data
              })
            }}
          />
          <List
            data={data}
            key='12'
            renderItem={dataItem => {
              const { Item } = List
              return <Item {...dataItem} />
            }}
            pagination={{
              total:200,
              pageSize:10,
              position:position
            }}
            action={dataItem => {
              return (
                <div style={{ height: '100%' }}>
                  <IconText name='star' text='123' />
                  <IconText
                    name='like'
                    text='8'
                    style={{ marginLeft: '24px' }}
                  />
                  <IconText name='step-on' style={{ marginLeft: '24px' }} />
                </div>
              )
            }}
          />
          </div>
        )
      }
    }`,
    opt: ['带有分页']
  }
]

const DemoBase = () => (
  <DocViewer
    desc={desc}
    code={code}
    scope={{ List, IconText, Radio }}
    rightOptions={rightOptions}
    prefix={prefix}
  />
)
export default DemoBase
