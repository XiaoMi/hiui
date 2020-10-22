import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table, { LegacyTable } from '../../../components/table'
import Watermark from '../../../components/Watermark'
const prefix = 'table-base'
const desc = ['基础：展示二维数据', '斑马行：优化以行为主的阅读体验']
const rightOptions = ['基础', '斑马行']
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
        return <Table columns={this.columns} data={this.data}/>
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
    
          { title: 'Column 1', dataIndex: 'name', key: '1'},
          { title: 'Column 1', dataIndex: 'age', key: '2'},
          { title: 'Column 1', dataIndex: 'address', key: '3'},
          {
            title: ()=><div>自定义标题</div>,
            dataIndex: 'address', key: '4',
            width: '500px',
            render(text,record,index){
            return (
              <div>
                  {text} --- {index} --- 自定义渲染
              </div>
            )
          }},
          {
            title: 'Action',
            key: 'operation',
            width: 100,
            render: () => <a href="javascript:;">action</a>,
          },
        ]
    
        this.data = []
        for (let i = 0; i < 10; i++) {
          this.data.push({
            // key: i,
            name: \`Don Diablo \${i}\`,
            age: \`\${i}\${i}\`,
            address: \`EDC Las Vegas no. \${i}\`,
          });
        }
      }
      render() {
        return <LegacyTable columns={this.columns} data={this.data}/>
      }
    }`,
    opt: ['v2']
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
