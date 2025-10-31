import React from 'react'
import Select from '@hi-ui/select'
import CheckSelect from '@hi-ui/check-select'
import Cascader from '@hi-ui/cascader'
import DatePicker from '@hi-ui/date-picker'
import Button from '@hi-ui/button'
import QueryFilter, {
  FilterFieldProps,
  FilterDrawer,
  SearchInput,
  FilterButton,
  QueryFilterProvider,
} from '../src'

/**
 * @title 全部筛选
 */
export const AllFilter = () => {
  const [filterFields, setFilterFields] = React.useState<FilterFieldProps[]>([
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
            {
              id: 'shanghai',
              title: '上海分店',
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
          dataSource={() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve([
                  {
                    id: 'phone',
                    title: '手机',
                  },
                  {
                    id: 'computer',
                    title: '电脑',
                  },
                  {
                    id: 'tablet',
                    title: '平板',
                  },
                ])
              }, 1000)
            })
          }}
        />
      ),
    },
    {
      field: 'cascader',
      label: '级联选择',
      visible: false,
      component: (
        <Cascader
          data={[
            {
              id: '1',
              title: '一级',
              children: [
                {
                  id: '1-1',
                  title: '二级',
                  children: [
                    {
                      id: '1-1-1',
                      title: '三级',
                    },
                  ],
                },
              ],
            },
          ]}
        />
      ),
    },
    {
      field: 'date-picker',
      label: '日期选择',
      visible: true,
      component: <DatePicker type="daterange" />,
    },
  ])

  const defaultFormData = {
    store: '',
    category: [],
    cascader: [],
    'date-picker': [],
  }

  const [formData, setFormData] = React.useState<Record<string, unknown>>(defaultFormData)

  const handleChange = (formData: Record<string, unknown>, fields: FilterFieldProps[]) => {
    console.log(formData, fields)

    setFormData(formData)
    setFilterFields(fields)
  }

  const [visible, setVisible] = React.useState(false)

  const showedFields = React.useMemo(() => {
    return filterFields.filter((field) => field.visible)
  }, [filterFields])

  // 判断是否为空值
  const isEmptyValue = (value: any) => {
    return (
      value === undefined ||
      value === '' ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    )
  }

  const filteredCount = React.useMemo(() => {
    return Object.values(formData).filter((value) => !isEmptyValue(value)).length
  }, [formData])

  return (
    <>
      <h1>AllFilter</h1>
      <div className="query-filter-all-filter__wrap">
        <QueryFilterProvider>
          <QueryFilter
            prepend={<SearchInput />}
            append={[
              <FilterButton key="all-filter" count={filteredCount} onClick={() => setVisible(true)}>
                全部筛选
              </FilterButton>,
              <Button key="reset" onClick={() => setFormData(defaultFormData)}>
                重置
              </Button>,
            ]}
            filterFields={showedFields}
            formData={formData}
            onChange={setFormData}
          />
          <FilterDrawer
            width={360}
            visible={visible}
            title="全部筛选"
            formData={formData}
            // 在抽屉中点击确定后会触发 onChange
            onChange={handleChange}
            // 在抽屉中选中控件值后会触发 onSelect
            onSelect={(val, allVals, filterField) => {
              console.log('onSelect', val, allVals, filterField)
            }}
            filterFields={filterFields}
            onClose={() => {
              setVisible(false)
            }}
            onPinChange={console.log}
            // 自定义抽屉中组件的 props
            customFieldProps={(filterField) => {
              console.log('customFieldProps', filterField)

              if (filterField.field === 'cascader') {
                return {
                  overlay: {
                    placement: 'bottom-end',
                  },
                }
              }

              if (filterField.field !== 'date-picker') {
                return {
                  optionWidth: undefined,
                }
              }
            }}
          />
        </QueryFilterProvider>
      </div>
    </>
  )
}
