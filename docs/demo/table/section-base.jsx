import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table, { LegacyTable } from '../../../components/table'
import Watermark from '../../../components/watermark'
const prefix = 'table-base'
const desc = ['基础：展示二维数据', '斑马行：优化以行为主的阅读体验', '前端分页：数据量大时分页展示']
const rightOptions = ['基础', '斑马行', '前端分页']
const code = [
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
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
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '单价',
            dataKey: 'price',
            width: 150

          },
         
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '单价',
            dataKey: 'price',
            width: 150

          },
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '单价',
            dataKey: 'price',
            width: 150

          },
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '单价',
            dataKey: 'price',
            width: 150

          },
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '单价',
            dataKey: 'price',
            width: 150

          },
         
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '单价',
            dataKey: 'price',
            width: 150

          },
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '单价',
            dataKey: 'price',
            width: 150

          },
         
          {
            title: '规格',
            dataKey: 'size',
            width: 150

          },
          {
            title: '单价',
            dataKey: 'price',
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
        return <Table columns={this.columns} draggable resizable fixedToColumn={{left:'type', right: 'address'}} data={this.data}/>
      }
    }`,
    opt: ['基础']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: '商品名',
            dataKey: 'name'
          },
          {
            title: '品类',
            dataKey: 'type'
          },
          {
            title: '规格',
            dataKey: 'size'
          },
          {
            title: '单价',
            dataKey: 'price'
          },
          {
            title: '门店',
            dataKey: 'address'
          },
          {
            title: '库存',
            dataKey: 'stock'
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
        return <Table columns={this.columns} data={this.data} striped/>
      }
    }`,
    opt: ['斑马行']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: '商品名',
            dataKey: 'name'
          },
          {
            title: '品类',
            dataKey: 'type'
          },
          {
            title: '规格',
            dataKey: 'size'
          },
          {
            title: '单价',
            dataKey: 'price'
          },
          {
            title: '门店',
            dataKey: 'address'
          },
          {
            title: '库存',
            dataKey: 'stock'
          }
        ]
        this.dataSource = [
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
          },
          {
            name: '小米10',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '3299.00',
            address: '华润五彩城店',
            stock: '29,000',
            key: 6
          },
          {
            name: '小米10 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '1999.00',
            address: '清河店',
            stock: '10,000',
            key: 7
          },
          {
            name: '小米8',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '2599.00',
            address: '双安店',
            stock: '12,000',
            key: 8
          },
          {
            name: 'Redmi Note7',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '999.00',
            address: '华润五彩城店',
            stock: '140,000',
            key: 9
          },
          {
            name: '小米8 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '699.00',
            address: '双安店',
            stock: '12,000',
            key: 10
          }
        ]
        this.state={
          current: 0,
          data: this.dataSource.slice(0, 5)
        }
      }
      render() {
        return <Table columns={this.columns} data={this.state.data} pagination={{
          pageSize: 5,
          total: this.dataSource.length,
          current: this.state.current,
          onChange: (page, pre, size) => {
            console.log(page, pre, size)
            this.setState({current: page, data:this.dataSource.slice(size * (page - 1), size * page) })
          }
        }}/>
      }
    }`,
    opt: ['前端分页']
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Table, Watermark, LegacyTable }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc={desc}
  />
)
export default DemoBase
