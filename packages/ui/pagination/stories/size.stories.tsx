import React from 'react'
import { Space } from '@hi-ui/space'
import Pagination from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>不同尺寸</h1>
      <div className="button-basic__wrap">
        <h2>xs</h2>
        <Space direction="column" size="md" align="flex-start">
          <Pagination
            total={200}
            pageSize={10}
            showTotal
            showJumper
            showPagers
            size="xs"
            pageSizeOptions={[10, 20, 50, 100]}
            onChange={(cur, prev, pageSize) => {
              console.log('onChange', cur, prev, pageSize)
            }}
          />
          <Pagination
            type="shrink"
            total={200}
            pageSize={10}
            size={'xs'}
            onChange={(cur) => {
              console.log('onChange', cur)
            }}
          />
        </Space>
        <h2>sm</h2>
        <Space direction="column" size="md" align="flex-start">
          <Pagination
            total={200}
            pageSize={10}
            showTotal
            showJumper
            showPagers
            size="sm"
            pageSizeOptions={[10, 20, 50, 100]}
            onChange={(cur, prev, pageSize) => {
              console.log('onChange', cur, prev, pageSize)
            }}
          />
          <Pagination
            type="shrink"
            total={200}
            pageSize={10}
            size="sm"
            onChange={(cur) => {
              console.log('onChange', cur)
            }}
          />
        </Space>
        <h2>md</h2>
        <Space direction="column" size="md" align="flex-start">
          <Pagination
            total={200}
            pageSize={10}
            showTotal
            showJumper
            showPagers
            size="md"
            pageSizeOptions={[10, 20, 50, 100]}
            onChange={(cur, prev, pageSize) => {
              console.log('onChange', cur, prev, pageSize)
            }}
          />
          <Pagination
            type="shrink"
            total={200}
            pageSize={10}
            size="md"
            onChange={(cur) => {
              console.log('onChange', cur)
            }}
          />
        </Space>
      </div>
    </>
  )
}
