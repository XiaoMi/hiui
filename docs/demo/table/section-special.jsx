import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-special'
const desc = ['全边框：运用分割线让行列关系更清晰明确', '树形表格：首列是树形结构，每个树杈都可共用表头']
const rightOptions = ['全边框', '树形表格']
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
        return <Table columns={this.columns} data={this.data} bordered/>
      }
    }`,
    opt: ['全边框']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      render() {
        return <Table
        data={[
          {
            a: 'a-1',
            b: 'b-1',
            c: 'c-1',
            d: 'd-1',
            key: 1,
            children: [
              {
                a: 'a-1-1',
                b: 'b-1-1',
                c: 'c-1-1',
                d: 'd-1-1',
                key: '1-1',
                children: [
                  { a: 'a-1-1-1', b: 'b-1-1-1', c: 'c-1-1-1', d: 'd-1-1-1', key: '1-1-1' },
                  { a: 'a-1-1-2', b: 'b-1-1-2', c: 'c-1-1-2', d: 'd-1-1-2', key: '1-1-2' }
                ]
              },
              { a: 'a-1-2', b: 'b-1-2', c: 'c-1-2', d: 'd-1-2', key: '1-2' }
            ]
          },
          { a: 'a-2', b: 'b-2', c: 'c-2', d: 'd-2', key: 2 },
          { a: 'a-3', b: 'b-3', c: 'c-3', d: 'd-3', key: 3 },
          { a: 'a-4', b: 'b-4', c: 'c-4', d: 'd-4', key: 4 }
        ]}
        columns={[
          { title: 'A', dataKey: 'a' },
          { title: 'B', dataKey: 'b' },
          { title: 'C', dataKey: 'c' },
          { title: 'D', dataKey: 'd' }
        ]}
      />
      }
    }`,
    opt: ['树形表格']
  }
]

const DemoBase = () => (
  <DocViewer code={code} scope={{ Table }} prefix={prefix} rightOptions={rightOptions} desc={desc} />
)
export default DemoBase
