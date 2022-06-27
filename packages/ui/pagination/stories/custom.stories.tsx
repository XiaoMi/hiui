import React from 'react'
import Pagination from '../src'
import Form from '@hi-ui/form'
import Switch from '@hi-ui/switch'
import Select from '@hi-ui/select'
import NumberInput from '@hi-ui/number-input'

/**
 * @title 自定义组合
 * @desc 灵活搭配，适配不同的场景
 */
export const Custom = () => {
  const [paginationProps, setPaginationProps] = React.useState<any>({
    total: 200,
    showTotal: true,
    showJumper: true,
    showPagers: true,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    current: 1,
  })

  return (
    <>
      <h1>自定义组合</h1>
      <div className="pagination-basic__wrap">
        <div>
          <Form
            initialValues={paginationProps}
            onValuesChange={(_, allValues) => {
              setPaginationProps(allValues)
            }}
            style={{ display: 'flex', columnGap: 12, flexWrap: 'wrap' }}
          >
            <Form.Item label="ShowTotal" field="showTotal" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="ShowJumper" field="showJumper" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="ShowPagers" field="showPagers" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="PageSize" field="pageSize">
              <Select
                data={[
                  { id: 10, title: '10' },
                  { id: 20, title: '20' },
                  { id: 50, title: '50' },
                  { id: 100, title: '100' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Total" field="total">
              <NumberInput />
            </Form.Item>
          </Form>
        </div>
        <Pagination
          {...paginationProps}
          onChange={(cur) => {
            // updateCurrent(cur)
          }}
        />
      </div>
    </>
  )
}
