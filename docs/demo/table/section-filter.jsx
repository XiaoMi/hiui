import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table, { LegacyTable } from '../../../components/table'
import Watermark from '../../../components/watermark'
import Input from '../../../components/input'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
const prefix = 'table-filter'
const desc = ['自定义筛选']
const rightOptions = ['排序', '筛选', '自定义筛选']
const code = [
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    import Icon from '@hi-ui/hiui/es/icon'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: '商品名',
            dataKey: 'name',
            width: 150
          },
          {
            title: '品类',
            dataKey: 'type',
            width: 150
          },
          {
            title: '单价',
            dataKey: 'price',
            width: 150,
            sorter: (a, b) => {
              console.log(a, b)
              return a.price - b.price
            }
          },
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '门店',
            dataKey: 'address',
            width: 150

          },
          {
            title: '库存',
            dataKey: 'stock',
            width: 150

          }
        ]

        this.data = [
          {
            name: '小米9',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '3299.00',
            address: '华润五彩城店',
            stock: '29,000',
            key: 1
          },
          {
            name: '小米9 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '1999.00',
            address: '清河店',
            stock: '10,000',
            key: 2
          },
          {
            name: '小米8',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '2599.00',
            address: '双安店',
            stock: '12,000',
            key: 3
          },
          {
            name: 'Redmi Note7',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '999.00',
            address: '华润五彩城店',
            stock: '140,000',
            key: 4
          },
          {
            name: '小米8 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '699.00',
            address: '双安店',
            stock: '12,000',
            key: 5
          }
        ]
      }
      render() {
        return <Table columns={this.columns}  data={this.data}/>
      }
    }`,
    opt: ['排序']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    import Icon from '@hi-ui/hiui/es/icon'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: '商品名',
            dataKey: 'name',
            width: 150
          },
          {
            title: '品类',
            dataKey: 'type',
            width: 150,
            selectFilters: {
              filterIcon: <Icon name="filter" />,
              data: [
                { title:'电视', id:'3', disabled: true },
                { title:'手机', id:'2' },
                { title:'笔记本', id:'4', disabled: true },
                { title:'生活周边', id:'5' },
                { title:'办公', id:'6' },
              ],
              type: 'multiple',
              searchable: true,
              showCheckAll: true,
              optionWidth: 200,
              onChange:() => {
                console.log('多选结果', item)
                
              }
            }
          },

          {
            title: '单价',
            dataKey: 'price',
            width: 150,
            filterDropdownClassName: 'table-customefilter',
            filterIcon: <Icon name="search" />,
            filterDropdown: ({columnData, setFilterDropdownVisible}) => {
              let keyWork = ''
              return (
                <div >
                <Input placeholder="请输入关键字" onChange={(e)=>{
                  keyWork = e.target.value
                }}/>
                <div style={{marginTop: '8px'}}>
                  <Button onClick={() => {
                    this.filterData(keyWork, 'name')
                    setFilterDropdownVisible(false)
                  }} type="primary" size="small">确定</Button>
                  <Button onClick={() => setFilterDropdownVisible(false)} size="small">取消</Button>
                </div>
                </div>
              )
            },
            sorter: (a, b) => {
              console.log(a, b)
              return a.price - b.price
            }
          },
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '门店',
            dataKey: 'address',
            width: 150

          },
          {
            title: '库存',
            dataKey: 'stock',
            width: 150

          }
        ]

        this.data = [
          {
            name: '小米9',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '3299.00',
            address: '华润五彩城店',
            stock: '29,000',
            key: 1
          },
          {
            name: '小米9 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '1999.00',
            address: '清河店',
            stock: '10,000',
            key: 2
          },
          {
            name: '小米8',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '2599.00',
            address: '双安店',
            stock: '12,000',
            key: 3
          },
          {
            name: 'Redmi Note7',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '999.00',
            address: '华润五彩城店',
            stock: '140,000',
            key: 4
          },
          {
            name: '小米8 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '699.00',
            address: '双安店',
            stock: '12,000',
            key: 5
          }
        ]
      }
      render() {
        return <Table columns={this.columns}  data={this.data}/>
      }
    }`,
    opt: ['筛选']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    import Icon from '@hi-ui/hiui/es/icon'\n
    import Button from '@hi-ui/hiui/es/button'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: '商品名',
            dataKey: 'name',
            width: 150,
            filterDropdownClassName: 'table-customefilter',
            filterIcon: <Icon name="search" />,
            filterDropdown: ({columnData, setFilterDropdownVisible}) => {
              let keyWork = ''
              return (
                <div >
                <Input placeholder="请输入关键字" onChange={(e)=>{
                  keyWork = e.target.value
                }}/>
                <div style={{marginTop: '8px'}}>
                  <Button onClick={() => {
                    this.filterData(keyWork, 'name')
                    setFilterDropdownVisible(false)
                  }} type="primary" size="small">确定</Button>
                  <Button onClick={() => setFilterDropdownVisible(false)} size="small">取消</Button>
                </div>
                </div>
              )
            }
          },
          {
            title: '品类',
            dataKey: 'type',
            width: 150,
            filterIcon: <Icon name="search" />,
            filterDropdown: ({columnData, setFilterDropdownVisible}) => {
              console.log(columnData)
              return (
                <div >
                <Input placeholder="请输入关键字" />
                <div style={{marginTop: '8px'}}>
                  <Button onClick={() => setFilterDropdownVisible(false)} type="primary" size="small">确定</Button>
                  <Button onClick={() => setFilterDropdownVisible(false)} size="small">取消</Button>
                </div>
                </div>
              )
            }
          },
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '单价',
            dataKey: 'price',
            width: 150,
            sorter: (a, b) => {
              console.log(a, b)
              return a - b
            }
          },
         
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '门店',
            dataKey: 'address',
            width: 150

          },
          {
            title: '库存',
            dataKey: 'stock',
            width: 150

          }
        ]
        this.state = {
          data: [
            {
              name: '小米9',
              type: '手机',
              size: '6G+64G 全息幻彩蓝',
              price: '3299.00',
              address: '华润五彩城店',
              stock: '29,000',
              key: 1
            },
            {
              name: '小米9 SE',
              type: '手机',
              size: '6G+64G 全息幻彩蓝',
              price: '1999.00',
              address: '清河店',
              stock: '10,000',
              key: 2
            },
            {
              name: '小米8',
              type: '手机',
              size: '6G+64G 全息幻彩蓝',
              price: '2599.00',
              address: '双安店',
              stock: '12,000',
              key: 3
            },
            {
              name: 'Redmi Note7',
              type: '手机',
              size: '6G+64G 全息幻彩蓝',
              price: '999.00',
              address: '华润五彩城店',
              stock: '140,000',
              key: 4
            },
            {
              name: '小米8 SE',
              type: '手机',
              size: '6G+64G 全息幻彩蓝',
              price: '699.00',
              address: '双安店',
              stock: '12,000',
              key: 5
            }
          ]
        }
      }
      filterData(keyWord, label) {
        this.setState({
          data: this.state.data.filter(item=>{
            return item[label].includes(keyWord)
          })
        })
      }
      render() {
        return <Table columns={this.columns}  data={this.state.data}/>
      }
    }`,
    opt: ['自定义筛选']
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Table, Watermark, LegacyTable, Icon, Input, Button }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc={desc}
  />
)
export default DemoBase
