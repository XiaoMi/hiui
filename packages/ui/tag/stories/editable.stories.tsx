import { SunFilled } from '@hi-ui/icons'
import React from 'react'
import Tag from '../src'

export const Editable = () => {
  const [testValue1, setTestValue1] = React.useState('test-value')
  const [testValue2, setTestValue2] = React.useState('test-value')

  return (
    <>
      <h1>Tag Editable</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Tag editable onEdit={setTestValue1} type={'primary'}>
          {testValue1}
        </Tag>
        <Tag appearance={'solid'} editable onEdit={setTestValue2} type={'primary'}>
          {testValue2}
        </Tag>

        <Tag
          type={'primary'}
          render={(children) => (
            <span>
              <SunFilled style={{ marginRight: '2px' }} />
              {children}
            </span>
          )}
          maxWidth={240}
          editable
        >
          Test Content Max Length Placeholder Max Length Placeholder
        </Tag>
      </div>
    </>
  )
}
