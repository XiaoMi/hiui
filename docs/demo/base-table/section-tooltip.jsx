import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import HiBaseTable, { AutoResizer, SortOrder } from '../../../components/hi-base-table'
import Watermark from '../../../components/watermark'
import Tooltip from '../../../components/tooltip'
const prefix = 'table-bigdata'
const rightOptions = ['结合Tooltip', '树形表格', '列冻结', '树形 + 列冻结 + 吸顶 + 排序']
// 格式化 Columns
const code = [
  {
    code: `import React from 'react'
    import HiBaseTable from '@hi-ui/hiui/es/hi-base-table'\n
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
    import HiBaseTable , {SortOrder} from '@hi-ui/hiui/es/hi-base-table'\n
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
  },
  {
    code: `import React from 'react'
    import HiBaseTable from '@hi-ui/hiui/es/hi-base-table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            key: 'column-0',
            dataKey: 'column-0',
            title: 'Column 0',
            width: 150,
            sortable: true
          },
          { key: 'column-1', dataKey: 'column-1', title: 'Column 1', width: 150, sortable: true },
          { key: 'column-2', dataKey: 'column-2', title: 'Column 2', width: 150 },
          { key: 'column-3', dataKey: 'column-3', title: 'Column 3', width: 150 },
          { key: 'column-4', dataKey: 'column-4', title: 'Column 4', width: 150 },
          { key: 'column-5', dataKey: 'column-5', title: 'Column 5', width: 150 },
          { key: 'column-6', dataKey: 'column-6', title: 'Column 6', width: 150 },
          { key: 'column-7', dataKey: 'column-7', title: 'Column 7', width: 150 },
          { key: 'column-8', dataKey: 'column-8', title: 'Column 8', width: 150 },
          { key: 'column-9', dataKey: 'column-9', title: 'Column 9', width: 150 },
          { key: 'column-10', dataKey: 'column-10', title: 'Column 10', width: 150 },
          { key: 'column-11', dataKey: 'column-11', title: 'Column 11', width: 150 },
          { key: 'column-12', dataKey: 'column-12', title: 'Column 12', width: 150 },
          { key: 'column-13', dataKey: 'column-13', title: 'Column 13', width: 150 },
          {
            key: 'column-14',
            dataKey: 'column-14',
            title: 'Column 14',
            width: 150,
          }
        ]
        this.state = {
          data:[
            {
              'column-0': 'Row 0 - Col 0',
              'column-1': 'Row 0 - Col 1',
              'column-2': 'Row 0 - Col 2',
              'column-3': 'Row 0 - Col 3',
              'column-4': 'Row 0 - Col 4',
              'column-5': 'Row 0 - Col 5',
              'column-6': 'Row 0 - Col 6',
              'column-7': 'Row 0 - Col 7',
              'column-8': 'Row 0 - Col 8',
              'column-9': 'Row 0 - Col 9',
              'column-10': 'Row 0 - Col 10',
              'column-11': 'Row 0 - Col 11',
              'column-12': 'Row 0 - Col 12',
              'column-13': 'Row 0 - Col 13',
              'column-14': 'Row 0 - Col 14',
              children: [
                {
                  'column-0': 'Sub 0',
                  'column-1': 'Row 0 - Col 1',
                  'column-2': 'Row 0 - Col 2',
                  'column-3': 'Row 0 - Col 3',
                  'column-4': 'Row 0 - Col 4',
                  'column-5': 'Row 0 - Col 5',
                  'column-6': 'Row 0 - Col 6',
                  'column-7': 'Row 0 - Col 7',
                  'column-8': 'Row 0 - Col 8',
                  'column-9': 'Row 0 - Col 9',
                  'column-10': 'Row 0 - Col 10',
                  'column-11': 'Row 0 - Col 11',
                  'column-12': 'Row 0 - Col 12',
                  'column-13': 'Row 0 - Col 13',
                  'column-14': 'Row 0 - Col 14',
                  children: [
                    {
                      'column-0': 'Sub 0',
                      'column-1': 'Row 0 - Col 1',
                      'column-2': 'Row 0 - Col 2',
                      'column-3': 'Row 0 - Col 3',
                      'column-4': 'Row 0 - Col 4',
                      'column-5': 'Row 0 - Col 5',
                      'column-6': 'Row 0 - Col 6',
                      'column-7': 'Row 0 - Col 7',
                      'column-8': 'Row 0 - Col 8',
                      'column-9': 'Row 0 - Col 9',
                      'column-10': 'Row 0 - Col 10',
                      'column-11': 'Row 0 - Col 11',
                      'column-12': 'Row 0 - Col 12',
                      'column-13': 'Row 0 - Col 13',
                      'column-14': 'Row 0 - Col 14',
                      children: [
                        {
                          'column-0': 'Sub-Sub 0',
                          'column-1': 'Row 0 - Col 1',
                          'column-2': 'Row 0 - Col 2',
                          'column-3': 'Row 0 - Col 3',
                          'column-4': 'Row 0 - Col 4',
                          'column-5': 'Row 0 - Col 5',
                          'column-6': 'Row 0 - Col 6',
                          'column-7': 'Row 0 - Col 7',
                          'column-8': 'Row 0 - Col 8',
                          'column-9': 'Row 0 - Col 9',
                          'column-10': 'Row 0 - Col 10',
                          'column-11': 'Row 0 - Col 11',
                          'column-12': 'Row 0 - Col 12',
                          'column-13': 'Row 0 - Col 13',
                          'column-14': 'Row 0 - Col 14',
                          children: []
                        }
                      ]
                    },
                    {
                      'column-0': 'Sub 1',
                      'column-1': 'Row 0 - Col 1',
                      'column-2': 'Row 0 - Col 2',
                      'column-3': 'Row 0 - Col 3',
                      'column-4': 'Row 0 - Col 4',
                      'column-5': 'Row 0 - Col 5',
                      'column-6': 'Row 0 - Col 6',
                      'column-7': 'Row 0 - Col 7',
                      'column-8': 'Row 0 - Col 8',
                      'column-9': 'Row 0 - Col 9',
                      'column-10': 'Row 0 - Col 10',
                      'column-11': 'Row 0 - Col 11',
                      'column-12': 'Row 0 - Col 12',
                      'column-13': 'Row 0 - Col 13',
                      'column-14': 'Row 0 - Col 14',
                      children: [
                        {
                          'column-0': 'Sub-Sub 1',
                          'column-1': 'Row 0 - Col 1',
                          'column-2': 'Row 0 - Col 2',
                          'column-3': 'Row 0 - Col 3',
                          'column-4': 'Row 0 - Col 4',
                          'column-5': 'Row 0 - Col 5',
                          'column-6': 'Row 0 - Col 6',
                          'column-7': 'Row 0 - Col 7',
                          'column-8': 'Row 0 - Col 8',
                          'column-9': 'Row 0 - Col 9',
                          'column-10': 'Row 0 - Col 10',
                          'column-11': 'Row 0 - Col 11',
                          'column-12': 'Row 0 - Col 12',
                          'column-13': 'Row 0 - Col 13',
                          'column-14': 'Row 0 - Col 14',
                          children: []
                        }
                      ]
                    }
                  ]
                },
                {
                  'column-0': 'Sub 1',
                  'column-1': 'Row 0 - Col 1',
                  'column-2': 'Row 0 - Col 2',
                  'column-3': 'Row 0 - Col 3',
                  'column-4': 'Row 0 - Col 4',
                  'column-5': 'Row 0 - Col 5',
                  'column-6': 'Row 0 - Col 6',
                  'column-7': 'Row 0 - Col 7',
                  'column-8': 'Row 0 - Col 8',
                  'column-9': 'Row 0 - Col 9',
                  'column-10': 'Row 0 - Col 10',
                  'column-11': 'Row 0 - Col 11',
                  'column-12': 'Row 0 - Col 12',
                  'column-13': 'Row 0 - Col 13',
                  'column-14': 'Row 0 - Col 14',
                  children: []
                }
              ]
            },
            {
              'column-0': 'Row 1 - Col 0',
              'column-1': 'Row 1 - Col 1',
              'column-2': 'Row 1 - Col 2',
              'column-3': 'Row 1 - Col 3',
              'column-4': 'Row 1 - Col 4',
              'column-5': 'Row 1 - Col 5',
              'column-6': 'Row 1 - Col 6',
              'column-7': 'Row 1 - Col 7',
              'column-8': 'Row 1 - Col 8',
              'column-9': 'Row 1 - Col 9',
              'column-10': 'Row 1 - Col 10',
              'column-11': 'Row 1 - Col 11',
              'column-12': 'Row 1 - Col 12',
              'column-13': 'Row 1 - Col 13',
              'column-14': 'Row 1 - Col 14',
              children: []
            }
          ]
        }
      }
      
      
      render() {
        return <HiBaseTable 
          autoResize={false} 
          columns={this.columns} 
          data={this.state.data} 
          height={500} 
          sticky={true}
          stickyTop={60}
          fixedToColumn={{left:'column-0',right:'column-12' }} 
          sortBy={{ key: 'column-0', order: 'asc' }}
          onColumnSort={({ column, key, order })=>{
            console.log('column, key, order', column, key, order)
            this.setState({
              data: this.state.data.reverse()
            })
          }} />
      }
    }`,
    opt: ['树形 + 列冻结 + 吸顶 + 排序']
  }
]

const DemoBase = () => (
  <DocViewer
    code={code}
    scope={{ HiBaseTable, Watermark, AutoResizer, Tooltip, SortOrder }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoBase
