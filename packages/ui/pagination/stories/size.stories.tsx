import React from 'react'
import Pagination from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>不同尺寸</h1>
      <div className="button-basic__wrap">
        <div style={{ marginBottom: 20 }}>
          <Pagination
            total={200}
            pageSize={10}
            showTotal
            showJumper
            showPagers
            size="sm"
            onChange={(cur, prev, pageSize) => {
              console.log('onChange', cur, prev, pageSize)
            }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Pagination
            type="shrink"
            total={200}
            pageSize={10}
            size={'sm'}
            onChange={(cur) => {
              console.log('onChange', cur)
            }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Pagination
            total={200}
            pageSize={10}
            showTotal
            showJumper
            showPagers
            size="md"
            onChange={(cur, prev, pageSize) => {
              console.log('onChange', cur, prev, pageSize)
            }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Pagination
            type="shrink"
            total={200}
            pageSize={10}
            size="md"
            onChange={(cur) => {
              console.log('onChange', cur)
            }}
          />
        </div>
        <div style={{ marginBottom: 24 }}></div>
      </div>
    </>
  )
}
