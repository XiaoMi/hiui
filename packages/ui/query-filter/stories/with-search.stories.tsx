import React from 'react'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import QueryFilter, { FilterFieldProps, SearchInput } from '../src'

/**
 * @title 带搜索框
 */
export const WithSearch = () => {
  const [filterFields] = React.useState<FilterFieldProps[]>([
    {
      field: 'store',
      label: '门店',
      visible: true,
      component: (
        <Select
          optionWidth={200}
          clearable
          data={[
            {
              id: 'wuhan',
              title: '武汉分店',
            },
            {
              id: 'beijing',
              title: '北京分店',
            },
          ]}
        />
      ),
    },
    {
      field: 'category',
      label: '分类',
      visible: true,
      component: (
        <CheckSelect
          optionWidth={200}
          clearable
          data={[
            {
              id: 'phone',
              title: '手机',
            },
            {
              id: 'computer',
              title: '电脑',
            },
          ]}
        />
      ),
    },
  ])

  const [formData, setFormData] = React.useState<Record<string, unknown>>({
    store: '',
    category: [],
  })

  const handleChange = (formData: Record<string, unknown>) => {
    setFormData(formData)
  }

  return (
    <>
      <h1>WithSearch</h1>
      <div className="query-filter-with-search__wrap">
        <QueryFilter
          prepend={<SearchInput />}
          filterFields={filterFields}
          formData={formData}
          onChange={handleChange}
        />
      </div>
    </>
  )
}
