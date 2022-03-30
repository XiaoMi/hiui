import React from 'react'
import Tag from '../src'

export const Closeable = () => {
  return (
    <>
      <h1>Tag Closeable</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Tag appearance="filled" type="primary" closeable onDelete={() => console.log('click')}>
          Closeable default
        </Tag>
        <Tag appearance="filled" closeable>
          Closeable default
        </Tag>
        <Tag appearance="solid" type="primary" closeable>
          Closeable solid
        </Tag>
        <Tag appearance="solid" closeable>
          Closeable solid
        </Tag>
      </div>
    </>
  )
}
