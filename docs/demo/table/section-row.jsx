import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-row'
const desc = ['行高亮：突出某行数据且方便阅读']
const rightOptions = ['行高亮', '批量选择', '标题事件处理']
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
        dataKey: 'price',
        align: 'right',
      },
      {
        title: '门店',
        dataKey: 'address'
      },
      {
        title: '库存',
        dataKey: 'stock',
        align: 'right'
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
    return <Table columns={this.columns} data={this.data} highlightedRowKeys={[1]}/>
  }
}`,
    opt: ['行高亮']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.state={selectedRowKeys:[]}
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
            dataKey: 'price',
            align: 'right'
          },
          {
            title: '规格',
            dataKey: 'size'
          },
          {
            title: '单价',
            dataKey: 'price',
            align: 'right'
          },
          {
            title: '规格',
            dataKey: 'size'
          },
          {
            title: '单价',
            dataKey: 'price',
            align: 'right'
          },
          {
            title: '规格',
            dataKey: 'size'
          },
          {
            title: '单价',
            dataKey: 'price',
            align: 'right'
          },
          {
            title: '规格',
            dataKey: 'size'
          },
          {
            title: '单价',
            dataKey: 'price',
            align: 'right'
          },
          {
            title: '规格',
            dataKey: 'size'
          },
          {
            title: '单价',
            dataKey: 'price',
            align: 'right'
          },
          {
            title: '门店',
            dataKey: 'address'
          },
          {
            title: '库存',
            dataKey: 'stock',
            align: 'right'
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
        return (<Table
          columns={this.columns}
          data={this.data}
          fixedToColumn={'name'}
          rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys,
            getCheckboxConfig: record => {
              return {disabled: record.name === '小米9'}
            },
            onChange: selectedRowKeys => {
              this.setState({selectedRowKeys})
            }
          }}
        />)
      }
    }`,
    opt: ['批量选择']
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
        dataKey: 'price',
        align: 'right'
      },
      {
        title: '门店',
        dataKey: 'address'
      },
      {
        title: '库存',
        dataKey: 'stock',
        align: 'right'
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

    // 标题事件集合
    this.onHeaderRow = (item, index) => {
      return {
        // 单击
        onClick: event => {
          console.log('click callback', item, index)
        },
        // 双击
        onDoubleClick: event => {
          console.log('double click callback', item, index)
        },
        // 右键单击
        onContextMenu: event => {
          // 禁止右键默认事件
          event && event.preventDefault()
          console.log('right click callback', item, index)
        },
        // 鼠标进入
        onMouseEnter: event => {
          console.log('mouse enter callback', item, index)
        }, 
        // 鼠标移出
        onMouseLeave: event => {
          console.log('mouse leave callback', item, index)
        }
      }
    }
  }

  render() {
    return <Table columns={this.columns} data={this.data} onHeaderRow={this.onHeaderRow}/>
  }
}`,
    opt: ['标题事件处理']
  }
]

const DemoBase = () => (
  <DocViewer code={code} scope={{ Table }} prefix={prefix} rightOptions={rightOptions} desc={desc} />
)
export default DemoBase
