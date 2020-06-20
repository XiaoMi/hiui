import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTree from '../../../components/select-tree'
const prefix = 'tree-select-multiple'
const rightOptions = ['基础', '默认值', '数据回显', '默认展开']
const desc = '展示从多个收起的备选项中选出的一个选项'
const defaultStr = `constructor () {
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
              id: '0-0'
            },{
              title: 'ffff',
              id: '0-1',
              children: [{
                id: '0-1-1',
                title: 'fff-c'
              },{
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
`
const code = [
  {
    code: `import React from 'react'
import SelectTree from '@hi-ui/hiui/es/select-tree'\n
class Demo extends React.Component {
  ${defaultStr}
  render () {
    const { value, singleList } = this.state
    return (
      <SelectTree
        clearable
        searchable
        type='multiple'
        data={singleList}
        // searchMode='show'
        // defaultValue={[{id: '0-1-0-0-0'}]} // done
        // defaultExpandAll // done
        // defaultExpandIds={['1-2-0-0-0-0']} // done
        // showCheckedMode='ALL' //done
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
}`,
    opt: ['基础']
  },
  {
    code: `import React from 'react'
    import SelectTree from '@hi-ui/hiui/es/select-tree'\n
    class Demo extends React.Component {
      ${defaultStr}

      render () {
        const { value, singleList } = this.state
        return (
          <SelectTree
            type='multiple'
            clearable
            data={singleList}
            defaultValue={[{id: '0-1-0-0-0'}, {id: 'xx', title: '未包含在列表中'}]} // done
          />
        )
      }
    }`,
    opt: ['默认值']
  },
  {
    code: `import React from 'react'
    import SelectTree from '@hi-ui/hiui/es/select-tree'\n
    class Demo extends React.Component {
      ${defaultStr}

      render () {
        const { value, singleList } = this.state
        return (
          <SelectTree
            clearable
            type='multiple'
            data={singleList}
            showCheckedMode='PARENT'
          />
        )
      }
    }`,
    opt: ['数据回显']
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
            clearable
            type='multiple'
            data={singleList}
            defaultExpandIds={['1-2-0-0-0-0']}
          />
        )
      }
    }`,
    opt: ['默认展开']
  }
]
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
