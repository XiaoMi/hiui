import { DownOutlined } from '@hi-ui/icons'
import React from 'react'
import TagInput from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="tag-input-basic__wrap">
        <TagInput
          clearable
          // wrap={false}
          defaultValue={['1', '2', '不存在的测试']}
          suffix={<DownOutlined />}
          data={[
            {
              id: '1',
              title: '1',
            },
            {
              id: '2',
              title: '2',
            },
            {
              id: '3',
              title: '3',
            },
            {
              id: '4',
              title: '4',
            },
          ]}
        />
      </div>
    </>
  )
}
