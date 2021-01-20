import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import HiBaseTable, { AutoResizer } from '../../../components/hi-base-table'
import Watermark from '../../../components/watermark'
import Tooltip from '../../../components/tooltip'
import Text from 'react-texty'
const prefix = 'table-bigdata'
const rightOptions = ['结合Tooltip', '树形表格', '列冻结']
// 格式化 Columns
const code = [
  {
    code: `import React from 'react'
    import HiBaseTable from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = this.generateColumns(10)

        this.data = this.generateData(this.columns, 10)
      }
      // 格式化 Columns
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
            rowData[column.dataKey] = "Row" + rowIndex +" - Col" + "Row" + '-' + rowIndex +" - Col" 
            return rowData
          },
          {
            key: prefix + rowIndex,
          }
        )
      })
    }
    TableCell({ className, cellData }){
        return <Tooltip title={cellData} className={className} >
            <p style={{width: '100%', overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            {cellData}
            </p>
          </Tooltip>
        }
    render() {
        return <HiBaseTable
        columns={this.columns}
        data={this.data}
        components={{ TableCell: this.TableCell }}
    />
    }
}`,
    opt: ['结合Tooltip']
  },
  {
    code: `import React from 'react'
    import HiBaseTable from '@hi-ui/hiui/es/hi-base-table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
      }

      render() {
              return (
                <HiBaseTable
                data={[
                    {
                      a: 'a-1',
                      b: 'b-1',
                      c: 'c-1',
                      d: 'd-1',
                      key:'1',
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
              )
      }
    }`,
    opt: ['树形表格']
  },
  {
    code: `import React from 'react'
    import HiBaseTable from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = this.generateColumns(10)

        this.data = this.generateData(this.columns, 100)
      }
      // 格式化 Columns
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
        return <HiBaseTable columns={this.columns} data={this.data} height={500} fixedToColumn={{left:'column-1',right:'column-9' }} />
      }
    }`,
    opt: ['列冻结']
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ HiBaseTable, Watermark, AutoResizer, Tooltip, Text }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoBase
