import React from 'react'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import QueryFilter, { FilterFieldProps } from '../src'

/**
 * @title 基础用法
 */
export const Basic = () => {
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
    console.log('formData', formData)

    setFormData(formData)
  }

  return (
    <>
      <h1>Basic</h1>
      <div className="query-filter-basic__wrap">
        <QueryFilter filterFields={filterFields} formData={formData} onChange={handleChange} />
      </div>
    </>
  )
}
