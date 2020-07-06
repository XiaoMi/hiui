import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTree from '../../../components/select-tree'
const prefix = 'tree-select-multiple'
const rightOptions = ['基础', '默认值', '数据回显', '默认展开']
const desc = '展示从多个收起的备选项中选出的一个选项'
const defaultStr = `constructor () {
    super()
    this.state = {
      value: '1-0-1',
      expandIds: ['1-2-0-0-0-0', '1-0', '0-1'],
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
                  id: '1-0-1'
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
  clickEvent1 () {
    this.setState({
      singleList: [{
        id: '0',
        title: 'new Tree'
      }]
    })
  }
  clickEvent2() {
    this.setState({
      value: ['0-1-0-0-0']
      //0-1-0-0-0
    })
  }
  clickEvent3() {
    this.setState({
      expandIds: ['0-1']
      //0-1-0-0-0
    })
  }
  clickEvent4() {
    this.setState({
      singleList: [{
        id: '11',
        title: '11',
        children: [{
          id: '11-0',
          title: '1-0'
        }]
      }],
      expandIds: ['11']
      //0-1-0-0-0
    })
  }
  render () {
    const { value, singleList, expandIds } = this.state
    return (
      <div>
        <SelectTree
          clearable
          type='multiple'
          data={singleList}
          searchMode='filter'  //    highlight / filter
          value={value} // done
          expandIds={expandIds}
          // defaultExpandAll // done
          // defaultExpandIds={['1-2-0-0-0-0']} // done
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
        <button onClick={this.clickEvent1.bind(this)}>更改源数据</button>
        <button onClick={this.clickEvent2.bind(this)}>更改默认值</button>
        <button onClick={this.clickEvent3.bind(this)}>更改默认展开值</button>
        <button onClick={this.clickEvent4.bind(this)}>同时更改源数据和展开项</button>

      </div>
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
        const { singleList } = this.state
        return (
          <SelectTree
            type='multiple'
            clearable
            data={singleList}
            defaultValue={[{id: '0-1-0-0-0'}]} // done
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
