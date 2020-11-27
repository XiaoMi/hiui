import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import SelectTree from '../../../components/select-tree'
const prefix = 'tree-select-async'
const rightOptions = ['异步单选', '异步多选', '异步加载子节点']
const desc = '展示从多个收起的备选项中选出的一个选项'
const code = [
  {
    code: `import React from 'react'
    import SelectTree from '@hi-ui/hiui/es/select-tree'\n
    class Demo extends React.Component {
      render () {
        return (
          <SelectTree
            clearable
            dataSource={key => {
              return {
                method: 'GET',
                key: 'id',
                params: {pId: key},
                url: 'http://my-json-server.typicode.com/hiui-group/db/fulldata',
                transformResponse: (res) => {
                  console.log(2, res)
                  return res.map(r => {
                    return {
                      ...r,
                      id: r.code,
                      title: r.name
                    }
                  })
                }
              }
            }}
          />
        )
      }
    }`,
    opt: ['异步单选']
  },
  {
    code: `import React from 'react'
    import SelectTree from '@hi-ui/hiui/es/select-tree'\n
    class Demo extends React.Component {
      render () {
        return (
          <SelectTree
            clearable
            type='multiple'
            dataSource={key => {
              return {
                type: 'GET',
                key: 'id',
                params: {pId: key},
                url: 'http://my-json-server.typicode.com/hiui-group/db/fulldata',
                transformResponse: (res) => {
                  return res.map(r => {
                    return {
                      ...r,
                      id: r.code,
                      title: r.name
                    }
                  })
                }
              }
            }}
          />
        )
      }
    }`,
    opt: ['异步多选']
  },
  {
    code: `import React from 'react'
    import SelectTree from '@hi-ui/hiui/es/select-tree'

    class Demo extends React.Component {
      render () {
        return (
          <SelectTree
            clearable
            dataSource={key => {
              return {
                method: 'GET',
                key: 'id',
                params: {pId: key ? key : -1},
                url: 'https://mife-gallery.test.mi.com/hiui/tree',
                transformResponse: (res) => {
                  console.log(2, res)
                  return res.data.map(r => {
                    return {
                      ...r,
                      id: r.id,
                      title: r.title
                    }
                  })
                }
              }
            }}
          />
        )
      }
    }`,
    opt: ['异步加载子节点']
  }
]
const DemoType = () => (
  <DocViewer code={code} scope={{ SelectTree }} prefix={prefix} rightOptions={rightOptions} desc={desc} />
)
export default DemoType
