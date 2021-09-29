import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-special'
const desc = [
  '全边框：运用分割线让行列关系更清晰明确',
  '树形表格：首列是树形结构，每个树杈都可共用表头',
  '内嵌式：表格每行隐藏部分数据，递进呈现'
]
const rightOptions = [
  '表头分组固定列',
  '表头分组',
  '全边框',
  '树形表格',
  '异步树形表格',
  '内嵌式',
  '内嵌式异步渲染',
  '表头吸顶',
  '固定表头',
  '合并单元格'
]
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
        return <Table columns={this.columns}  data={this.data} bordered/>
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
        expandRowKeys={[1]}
        fixedToColumn={'a'}
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
                  { a: 'a-1-1-1', b: 'b-1-1-1', c: 'c-1-1-1', d: 'd-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1d-1-1-1', key: '1-1-1' },
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
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      render() {
        return <Table
        fixedToColumn={'a'}
        onLoadChildren={(row)=>{
          console.log(row)
          return new Promise((resolve, reject)=>{
            setTimeout(()=>{
              resolve([
                {
                a: row.key+'a',
                b: 'b-1-1',
                c: 'c-1-1',
                d: 'd-1-1',
                key: row.key + '1-1'
              }
              ])
            }, 1000)
          })
        }}
        data={[
          {
            a: 'a-1',
            b: 'b-1',
            c: 'c-1',
            d: 'd-1',
            key: 1,
            isLeaf: true
          },
          { a: 'a-2', b: 'b-2', c: 'c-2', d: 'd-2', key: 2, isLeaf: true },
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
    opt: ['异步树形表格']
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
    return <Table 
      columns={this.columns} 
      data={this.data}
      onExpand={(expanded, row) => {
        console.log(expanded, row)
      }} 
      fixedToColumn={'name'}
      rowExpandable={(rowData)=>{
        return rowData.key !== 2
       }}
       expandRowKeys={[1]}
      expandedRender={(rowData, index) => {
        return (
              <div style={{paddingLeft:50}}>
                <div>商品名称：{rowData.name}</div>
                <div>供应商：小米科技有限公司</div>
                <div>供货日期：2020-08-11</div>
              </div>
              )
      }} 
    />
  }
}`,
    opt: ['内嵌式']
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
  }
  render() {
    return <Table 
      columns={this.columns} 
      data={this.data}

      onExpand={(expanded, row) => {
        console.log(expanded, row)
      }} 
      expandedRender={(rowData, index) => {
        const {name} = rowData
        return new Promise((resolve, reject)=>{
          // 模拟异步
          const url = 'https://www.fastmock.site/mock/eef9b373d82560f30585521549c4b6cb/hiui/api/list?keyword=1'
          fetch(url)
              .then((response)=> {
                // 成功调用 reslove 
                if(response.status === 200) {
                  resolve(
                    <div style={{paddingLeft:50}}>
                      <div>商品名称：{name}</div>
                      <div>供应商：小米科技有限公司</div>
                      <div>供货日期：2020-08-11</div>
                    </div>
                    )
                } else {
                  reject('获取数据失败')
                }
                
              })
        })
      }} 
    />
  }
}`,
    opt: ['内嵌式异步渲染']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.state={selectedRowKeys:[]}
        this.columns =  [
          {
            title: 'Name',
            dataKey: 'name',
            key: '1',
            width: 100
          },
          {
            title: 'Other',

            children: [
              {
                title: 'Age',
                dataKey: 'age',
                key: 2,
                width: 100

              },
              {
                title: 'Address',

                children: [
                  {
                    title: 'Street',
                    dataKey: 'street',
                    key: '3',
                    width: 100

                  },
                  {
                    title: 'Block',
                    children: [
                      {
                        title: 'Building',
                        dataKey: 'building',
                        key: '4',
                        width: 100

                      },
                      {
                        title: 'Door No.',
                        dataKey: 'number',
                        key: '5',
                        width: 100

                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100
          },
          {
            title: 'Company',
            key: '6',
            children: [
              {
                title: 'Address',
                dataKey: 'companyAddress',
                key: '7',
                width: 100
              },
              {
                title: 'Name',
                dataKey: 'companyName',
                key: '8',
                width: 100
              }
            ]
          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100

          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100

          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100

          },
          {
            title: 'Name2',
            dataKey: 'name2',
            width: 100

          },
          {
            title: 'Gender',
            dataKey: 'gender',
            key: '9',
            width: 100
          }
        ]
        let data = []
        for (let i = 0; i < 6; i++) {
          data.push({
            key: i,
            name: 'John Brown',
            age: i + 1,
            street: 'Lake Park',
            building: 'C',
            number: 2035,
            name2:'name2',
            companyAddress: 'Lake Street 42',
            companyName: 'SoftLake Co',
            gender: 'M'
          })
        }
        this.data = data
      }
      render() {
        return <Table 
        columns={this.columns}
        fixedToColumn={{left:'number', right: 'gender'}}
        data={this.data} 
        stickyTop={63}
        setting
        sticky
        rowSelection={{
          selectedRowKeys: this.state.selectedRowKeys,
          onChange: selectedRowKeys => {
            this.setState({selectedRowKeys})
          }
        }} />
      }
    }`,
    opt: ['表头分组固定列']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.state={selectedRowKeys:[]}
        this.columns =  [
          {
            title: 'Name',
            dataKey: 'name',
            key: '1'
          },
          {
            title: 'Other',

            children: [
              {
                title: 'Age',
                dataKey: 'age',
                key: 2
              },
              {
                title: 'Address',

                children: [
                  {
                    title: 'Street',
                    dataKey: 'street',
                    key: '3'
                  },
                  {
                    title: 'Block',
                    children: [
                      {
                        title: 'Building',
                        dataKey: 'building',
                        key: '4'
                      },
                      {
                        title: 'Door No.',
                        dataKey: 'number',
                        key: '5'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'Company',
            key: '6',
            children: [
              {
                title: 'Address',
                dataKey: 'companyAddress',
                key: '7'
              },
              {
                title: 'Name',
                dataKey: 'companyName',
                key: '8'
              }
            ]
          },
          {
            title: 'Gender',
            dataKey: 'gender',
            key: '9'
          }
        ]
        let data = []
        for (let i = 0; i < 6; i++) {
          data.push({
            key: i,
            name: 'John Brown',
            age: i + 1,
            street: 'Lake Park',
            building: 'C',
            number: 2035,
            companyAddress: 'Lake Street 42',
            companyName: 'SoftLake Co',
            gender: 'M'
          })
        }
        this.data = data
      }
      render() {
        return <Table 
        columns={this.columns}
        data={this.data} 
        rowSelection={{
          selectedRowKeys: this.state.selectedRowKeys,
          onChange: selectedRowKeys => {
            this.setState({selectedRowKeys})
          }
        }} />
      }
    }`,
    opt: ['表头分组']
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
      }
      render() {
        return <Table columns={this.columns} data={this.data} sticky stickyTop={63}/>
      }
    }`,
    opt: ['表头吸顶']
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
      }
      render() {
        return <Table columns={this.columns} data={this.data} maxHeight={200}/>
      }
    }`,
    opt: ['固定表头']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.renderContent = (value, row, index) => {
          const obj = {
            children: value,
            props: {}
          }
          if (index === 4) {
            obj.props.colSpan = 0
          }
          return obj
        }
        this.columns = [
          {
            title: 'Name',
            dataKey: 'name',
            render: (text, row, index) => {
              if (index < 4) {
                return <span>{text}</span>
              }
              return {
                children: <span>{text}</span>,
                props: {
                  colSpan: 4
                }
              }
            },
            key: 1
          },
          {
            title: 'Age',
            dataKey: 'age',
            key: 2,
            render: this.renderContent
          },
          {
            title: 'Home phone',
            dataKey: 'tel',
            key: 3,
            render: this.renderContent
          },
          {
            title: 'Address',
            dataKey: 'address',
            render: this.renderContent,
            key: 4
          }
        ]

        this.data = [
          {
            key: '1',
            name: 'John Brown',
            age: 32,
            tel: '0571-22098909',
            address: 'New York No. 1 Lake Park'
          },
          {
            key: '2',
            name: 'Jim Green',
            tel: '0571-22098333',
            age: 42,
            address: 'London No. 1 Lake Park'
          },
          {
            key: '3',
            name: 'Joe Black',
            age: 32,
            tel: '0575-22098909',
            address: 'Sidney No. 1 Lake Park'
          },
          {
            key: '4',
            name: 'Jim Red',
            age: 18,
            tel: '0575-22098909',
            address: 'London No. 2 Lake Park'
          },
          {
            key: '5',
            name: 'Jake White',
            age: 18,
            tel: '0575-22098909',
            address: 'Dublin No. 2 Lake Park'
          }
        ]
      }
      render() {
        return <Table columns={this.columns} data={this.data} />
      }
    }`,
    opt: ['合并单元格']
  }
]

const DemoBase = () => (
  <DocViewer code={code} scope={{ Table }} prefix={prefix} rightOptions={rightOptions} desc={desc} />
)
export default DemoBase
