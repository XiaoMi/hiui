import React from 'react'
import Tag from '../src'

export const MaxWidth = () => {
  const [maxEditableValue, setMaxEditableValue] = React.useState(
    'max 180px editable (placeholder1 placeholder2 placeholder3 placeholder4)'
  )

  return (
    <>
      <h1>Tag MaxWidth</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Tag maxWidth={240}>max 240px (placeholder1 placeholder2 placeholder3 placeholder4)</Tag>
        <Tag maxWidth={240} closeable>
          max 240px (placeholder1 placeholder2 placeholder3 placeholder4)
        </Tag>
        <Tag maxWidth={180} editable onEdit={setMaxEditableValue}>
          {maxEditableValue}
        </Tag>
      </div>
    </>
  )
}
