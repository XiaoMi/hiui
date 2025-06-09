import React from 'react'
import Tag from '../src'
import Button from '@hi-ui/button'
import { EditFilled } from '@hi-ui/icons'

/**
 * @title 自定义触发编辑模式
 * @desc 通过 render 函数，可以自定义标签的编辑方式
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
              <div>
                {children}
                <Button
                  appearance="link"
                  icon={<EditFilled color="#237FFA" />}
                  onClick={triggerEdit}
                ></Button>
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
