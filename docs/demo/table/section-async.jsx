import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
import Watermark from '../../../components/Watermark'
const prefix = 'table-async'
const desc = ['异步动态获取表格数据']
const rightOptions = ['异步请求', '斑马行']
const code = [
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
        constructor(props) {
            super(props)
            this.columns = [
                { title: 'Full Name', width: 100, dataKey: 'name', key: 'name' },
                { title: 'Age', width: 100, dataKey: 'age', key: 'age' },
                { title: 'Column 1', dataKey: 'address', key: '1' },
                { title: 'Column 2', dataKey: 'address2', key: '2' },
                { title: 'Column 3', dataKey: 'address3', key: '3' },
                { title: 'Column 4', dataKey: 'address4', key: '4' }
            ]
            const data = []

            for (let i = 0; i < 100; i++) {
                data.push({
                    key: i,
                        name: 'Jake White',
                        age: i,
                        tel: '0575-22098909',
                        phone: 18900010002,
                        address: 'Dublin No. 2 Lake Park'
                    })
            }

            this.state = {
                pageSize: 10,
                current: 1,
                data: data
            }
        }

        render() {
            return (
            <Table
                columns={this.columns}
                dataSource={()=>{
                return {
                    url:'https://mife-gallery.test.mi.com/hiui/stores',
                    transformResponse:(res)=>{
                        console.log(res)
                        const arr = []
                        for (let i = 0; i < 100; i++) {
                            arr.push({
                                key: i,
                                name: 'Jake White',
                                age: i,
                                tel: '0575-22098909',
                                phone: 18900010002,
                                address: 'Dublin No. 2 Lake Park'
                            })
                        }
                        return arr
                    }
                }
            }}
            
            />
            )
        }
    }`,
    opt: ['异步请求']
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
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ Table, Watermark }}
    prefix={prefix}
    rightOptions={rightOptions}
    desc={desc}
  />
)
export default DemoBase
