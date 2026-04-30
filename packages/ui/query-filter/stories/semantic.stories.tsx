import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Select from '@hi-ui/select'
import QueryFilter, {
  QueryFilterSemanticName,
  FilterDrawer,
  FilterDrawerSemanticName,
  FilterFieldProps,
  QueryFilterProvider,
} from '../src'

/**
 * @title QueryFilter 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 QueryFilter 进行更细粒度的样式控制
 */
export const QueryFilterSemantic = () => {
  const [selected, setSelected] = useState<QueryFilterSemanticName>()
  const [filterFields] = useState<FilterFieldProps[]>([
    {
      field: 'store',
      label: '门店',
      visible: true,
      component: (
        <Select
          optionWidth={200}
          clearable
          data={[
            { id: 'wuhan', title: '武汉分店' },
            { id: 'beijing', title: '北京分店' },
          ]}
        />
      ),
    },
  ])
  const [formData, setFormData] = useState<Record<string, unknown>>({ store: '' })

  return (
    <>
      <h1>QueryFilter Semantic</h1>
      <div className="query-filter-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <QueryFilter
              classNames={{
                root: 'my-query-filter__root',
                form: 'my-query-filter__form',
              }}
              styles={{
                [selected as string]: {
                  outline: '1px solid #ffbe0a',
                },
              }}
              filterFields={filterFields}
              formData={formData}
              onChange={setFormData}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'form', description: '表单区域' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as QueryFilterSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}

/**
 * @title FilterDrawer 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 FilterDrawer 进行更细粒度的样式控制
 */
export const FilterDrawerSemantic = () => {
  const [selected, setSelected] = useState<FilterDrawerSemanticName>()
  const [visible, setVisible] = useState(true)
  const [filterFields] = useState<FilterFieldProps[]>([
    {
      field: 'store',
      label: '门店',
      visible: true,
      component: (
        <Select
          optionWidth={200}
          clearable
          data={[
            { id: 'wuhan', title: '武汉分店' },
            { id: 'beijing', title: '北京分店' },
          ]}
        />
      ),
    },
  ])
  const [formData, setFormData] = useState<Record<string, unknown>>({ store: '' })

  return (
    <>
      <h1>FilterDrawer Semantic</h1>
      <div className="query-filter-drawer-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <QueryFilterProvider>
              <FilterDrawer
                visible={visible}
                onClose={() => setVisible(false)}
                title="全部筛选"
                filterFields={filterFields}
                formData={formData}
                onChange={(data) => setFormData(data)}
                classNames={{
                  root: 'my-filter-drawer__root',
                  footer: 'my-filter-drawer__footer',
                }}
                styles={{
                  [selected as string]: {
                    outline: '1px solid #ffbe0a',
                  },
                }}
              />
            </QueryFilterProvider>
            <button type="button" onClick={() => setVisible(true)}>
              打开筛选抽屉
            </button>
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素（抽屉容器）' },
                { title: 'footer', description: '底部操作区' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as FilterDrawerSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}
