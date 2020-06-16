import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTree from '../../../components/select-tree'
const prefix = 'alert-autoClose'
const rightOptions = []
const desc = '展示从多个收起的备选项中选出的一个选项'
const code = `import React from 'react'
import SelectTree from '@hi-ui/hiui/es/select-tree'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      value: '3',
      singleList: [
        {
          title: 'Node 0',
          id: '0',
          children: [
            {
              title: 'Child Node 0-0',
              id: '3'
            },{
              title: 'ffff',
              id: '0-1',
              children: [{
                title: 'ggg',
                id: '0-1-0',
                children: [{
                  title: 'hhh',
                  id: '0-1-0-0',
                  children: [{
                    title: 'iii',
                    id: '0-1-0-0-0'
                  }]
                }]
              }]
            },
          ]
        },
        {
          title: 'Node1',
          id: '1',
          children: [
            {
              title: 'Child Node 1-0',
              id: '1-0',
              children: [
                {
                  title: 'Child Node 1-0-0',
                  id: '1-0-0'
                },
                {
                  title: 'Child Node 1-0-1',
                  id: '1-0-1',
                  _children: [
                    {
                      title: 'Child Node 1-0-1-0',
                      id: '1-0-1-0'
                    },
                    {
                      title: 'Child Node 1-0-1-1',
                      id: '1-0-1-1'
                    },
                    {
                      title: 'Child Node 1-0-1-2',
                      id: '1-0-1-2'
                    },
                    {
                      title: 'Child Node 1-0-1-3',
                      id: '1-0-1-3'
                    }
                  ]
                },
                {
                  title: 'fff',
                  id: '1-0-2'
                },
                {
                  title: 'ggg',
                  id: '1-0-3'
                },
                {
                  title: '使用交流使用交流使用交流使用交流',
                  id: '1-0-4'
                },
                {
                  title: 'spec',
                  id: '1-0-5'
                }
              ]
            },
            {
              title: 'Child Node 1-1',
              id: '1-1'
            },
            {
              title: 'Child Node 1-2',
              id: '1-2',
              children: [
                {
                  title: 'Child Node 1-2-0',
                  id: '1-2-0',
                  children: [{
                    title: 'Child Node 1-2-0-0',
                    id: '1-2-0-0',
                    children: [{
                      title: 'Child Node 1-2-0-0-0',
                      id: '1-2-0-0-0',
                      children: [{
                        title: 'Child Node 1-2-0-0-0-0',
                        id: '1-2-0-0-0-0',
                        children: [{
                          title: 'Child Node 1-2-0-0-0-0-0',
                          id: '1-2-0-0-0-0-0',
                          children: [{
                            title: 'Child Node 1-2-0-0-0-0-0-0',
                            id: '1-2-0-0-0-0-0-0'
                          }]
                        }]
                      }]
                    }]
                  }]
                }
              ]
            }
          ]
        }
      ]
    }
  }

  render () {
    const { value, singleList } = this.state
    return (
      <SelectTree
        clearable
        // type='multiple'
        data={singleList}
        defaultValue={[{id: '0-1-0-0-0'}]}
        autoExpand={true}
        // dataSource={key => {
        //   return {
        //     type: 'GET',
        //     key: 'id',
        //     params: {pId: key},
        //     url: 'http://localhost:3000/tree',
        //     transformResponse: (res) => {
        //       return res.map(r => {
        //         return {
        //           ...r,
        //           id: r.code,
        //           title: r.name
        //         }
        //       })
        //     }
        //   }
        // }}
      />
    )
  }
}`
const DemoType = () => (
  <DocViewer
    code={code}
    scope={{ SelectTree }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc={desc}
  />
)
export default DemoType
