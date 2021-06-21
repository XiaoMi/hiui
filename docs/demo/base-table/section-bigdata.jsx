import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import HiBaseTable, { AutoResizer } from '../../../components/hi-base-table'
import Watermark from '../../../components/watermark'
const prefix = 'table-bigdata'
const rightOptions = ['10000 条数据']
// 格式化 Columns
const code = [
  {
    code: `import React from 'react'
    import HiBaseTable from '@hi-ui/hiui/es/hi-base-table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = this.generateColumns(10)

        this.data = this.generateData(this.columns, 10000)
      }
      generateColumns(count = 10, prefix = 'column-', props){
        return new Array(count).fill(0).map((column, columnIndex) => ({
          ...props,
          key: prefix + columnIndex,
          dataKey: prefix+columnIndex,
          title: "column" + columnIndex,
          width: 150
        }))
      }
        
  
      generateData(columns, count = 200, prefix = 'row-'){
        return new Array(count).fill(0).map((row, rowIndex) => {
          return columns.reduce(
            (rowData, column, columnIndex) => {
              rowData[column.dataKey] = "Row" + rowIndex +" - Col" + columnIndex
              return rowData
            },
            {
              key: prefix + rowIndex,
            }
          )
        })
      }
      render() {
        return  <div style={{widht:'100%', overFlow:'auto'}}>
        123
          <HiBaseTable columns={this.columns} data={this.data} height={500}/>
        </div>
      }
    }`,
    opt: ['10000 条数据']
  },
  {
    code: `import React from 'react'
    import HiBaseTable from '@hi-ui/hiui/es/hi-base-table'\n
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
        return <div style={{ width: '100%', height: '300px' }}>
          <AutoResizer>
            {(size) => {
              const { width, height } = size
              return (
                <HiBaseTable
                  columns={this.columns}
                  data={this.data}
                  width={width}
                  height={height}
                />
              )
            }}
          </AutoResizer>
        </div>
      }
    }`,
    opt: ['自适应']
  }
]

const DemoBase = () => (
  <DocViewer code={code} scope={{ HiBaseTable, Watermark, AutoResizer }} prefix={prefix} rightOptions={rightOptions} />
)
export default DemoBase
