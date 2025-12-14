import { SearchOutlined, FilterOutlined } from '@hi-ui/icons'
import React from 'react'
import Table from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'
import CheckSelect from '@hi-ui/check-select'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'

/**
 * @title 自定义过滤
 */
export const CustomFilter = () => {
  const initialData = React.useRef([
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      phone: '18889898989',
      email: 'john.brown@example.com',
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      phone: '18889898888',
      age: 42,
      email: 'jim.green@example.com',
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 22,
      phone: '18900010002',
      email: 'joe.black@example.com',
      address: 'Sidney No. 1 Lake Park',
    },
  ])
  const [data, setData] = React.useState(initialData.current)
  const customFilterData = (keyword: string, label: string) => {
    if (keyword.length > 0) {
      setData(
        initialData.current.filter((item) => {
          return typeof keyword === 'string'
            ? item[label].includes(keyword)
            : keyword.includes(item[label])
        })
      )
    } else {
      setData(initialData.current)
    }
  }

  const [columns] = React.useState([
    {
      title: 'Name',
      dataKey: 'name',
      width: 120,
      filterDropdownClassName: 'table-customefilter',
      filterIcon: <SearchOutlined />,
      filterDropdown({ setFilterDropdownVisible }) {
        let keyword = ''
        return (
          <div>
            <Input
              placeholder="请输入关键字"
              onChange={(e) => {
                keyword = e.target.value
              }}
            />
            <div style={{ marginTop: '12px', textAlign: 'right' }}>
              <Button onClick={() => setFilterDropdownVisible(false)} appearance="line" size="sm">
                取消
              </Button>
              <Button
                onClick={() => {
                  customFilterData(keyword, 'name')
                  setFilterDropdownVisible(false)
                }}
                type="primary"
                size="sm"
              >
                确定
              </Button>
            </div>
          </div>
        )
      },
      render(text) {
        return <EllipsisTooltip>{text}</EllipsisTooltip>
      },
    },
    {
      title: 'Age',
      dataKey: 'age',
      width: 80,
      sorter(pre, next) {
        return pre.raw.age - next.raw.age
      },
    },
    {
      title: (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          Home phone
          <CheckSelect
            style={{ width: 'auto', marginLeft: 2 }}
            optionWidth={200}
            customRender={<FilterOutlined />}
            searchable
            data={[
              { id: '18889898989', title: '18889898989' },
              { id: '18889898888', title: '18889898888' },
              { id: '18900010002', title: '18900010002' },
            ]}
            onChange={(value) => {
              console.log('value', value)
              customFilterData(value, 'phone')
            }}
          />
        </div>
      ),
      width: 180,
      render(text) {
        return <EllipsisTooltip>{text}</EllipsisTooltip>
      },
      dataKey: 'phone',
    },
    {
      title: 'Email',
      dataKey: 'email',
      width: 180,
    },
    {
      title: 'Address',
      width: 240,
      render(text) {
        return <EllipsisTooltip>{text}</EllipsisTooltip>
      },
      dataKey: 'address',
    },
  ])

  return (
    <>
      <h1>CustomFilter for Table</h1>
      <div className="table-custom-filter__wrap">
        <Table columns={columns} data={data} />
      </div>
    </>
  )
}
