import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
import Form from '../../../components/form/index'
import Input from '../../../components/input'
import Button from '../../../components/button'
import FormItem from '../../../components/form/Item'
const prefix = 'table-server'
const desc = '运用搜索方式从服务器端实时请求数据，有效减轻前端显示压力'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Form from '@hi-ui/hiui/es/form/index'
import FormItem from '@hi-ui/hiui/es/form/item'
import Input from '@hi-ui/hiui/es/input'
import Table from '@hi-ui/hiui/es/table'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      from: '',
      pageSize:2
    }

    window.selectTable = this
  }

  render () {
    const {
      from,
      pageSize
    } = this.state

    const rowSelection = {
      selectedRowKeys: [],
      onChange: (selectedRowKeys, rows) => {
        this.setState({selectedRowKeys})
      },
      dataName: 'id'
    }

    return (
      <div>
        发货工厂

        <Form inline>
          <FormItem>
           <Input onChange={(e) => this.setState({from: e.target.value})} />
          </FormItem>
          <FormItem>
          <Button onClick={(e) => {this.refs.serverTable.fetch()}}>查询当前页</Button>
          <Button onClick={(e) => {this.refs.serverTable.reset()}}>查询第一页</Button>
          </FormItem>
        </Form>
        <Table
          scrollX
          ref={'serverTable'}
          rowSelection={rowSelection}
          advance={{   // 表格高级功能（统计)
            sum: true,
            avg: true
          }}
          origin={{
            url: 'http://yapi.demo.qunar.com/mock/26534/hiui/server-table',
            currentPageName: 'pageNum', //分页的页码字端名(默认 current)
            autoDelayTime: 500,   // 自动发请求的时候，延迟时间(默认 200)
            // headers: {'OS': 'WEB'}, //设置请求头
            data: {
              from,
              pageSize
            },
            type: "GET",
            auto:true, // 自动发请求配置(默认false)
            success: (res) => {
              let {data: {list, columns,page: {pageSize, totalNum, pageNum}}} = res
              console.log(list, columns)
              return {
                data: list,
                columns,
                page: {
                  pageSize,
                  total: totalNum,
                  current: pageNum,
                  position: 'middle',
                  showTotal: true,

                  pageSizeOptions:[10,20,50,100],
                  sizeChangeEvent:(pageSize,current) => {
                    this.setState({
                      pageSize
                    })
                  },


                }
              }
            },
            error: (e) => {
              console.log('err',e)
            }
          }}
        />
      </div>
    )
  }
}`

const DemoServer = () => (
  <DocViewer
    code={code}
    scope={{ Table, Form, FormItem, Input, Button }}
    prefix={prefix}
    desc={desc}
  />
)
export default DemoServer
