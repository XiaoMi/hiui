import React from 'react'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import Button from '@hi-ui/button'
import QueryFilter, { FilterFieldProps } from '../src'

/**
 * @title 带重置按钮
 */
export const WithReset = () => {
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

  const defaultFormData = {
    store: '',
    category: [],
  }

  const [formData, setFormData] = React.useState<Record<string, unknown>>(defaultFormData)

  const handleChange = (formData: Record<string, unknown>) => {
    setFormData(formData)
  }

  return (
    <>
      <h1>WithReset</h1>
      <div className="query-filter-with-reset__wrap">
        <QueryFilter
          append={<Button onClick={() => setFormData(defaultFormData)}>重置</Button>}
          filterFields={filterFields}
          formData={formData}
          onChange={handleChange}
        />
      </div>
    </>
  )
}
