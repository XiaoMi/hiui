import React from 'react'
import Tag from '../src'
import Button from '@hi-ui/button'
import { EditFilled } from '@hi-ui/icons'

/**
 * @title 触发编辑
 * @desc 可在自定义渲染中，去定义如何触发组件的编辑状态
 */
export const TriggerEdit = () => {
  const [testValue, setTestValue] = React.useState('test-value66')

  return (
    <>
      <h1>TriggerEdit</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tag
          type="primary"
          editable
          onEdit={setTestValue}
          render={(children, triggerEdit) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {children}
                <Button
                  appearance="link"
                  size="sm"
                  icon={<EditFilled />}
                  style={{ marginLeft: 4 }}
                  onClick={triggerEdit}
                />
              </div>
            )
          }}
        >
          {testValue}
        </Tag>
      </div>
    </>
  )
}
