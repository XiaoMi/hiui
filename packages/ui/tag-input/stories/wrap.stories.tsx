import { DownOutlined } from '@hi-ui/icons'
import React from 'react'
import { TagInputMock } from '../src'

export const Wrap = () => {
  return (
    <>
      <h1>Wrap</h1>
      <div className="tag-input-wrap__wrap">
        <TagInputMock
          wrap
          clearable
          // style={{ width: 380 }}
          // wrap={false}
          // disabled
          defaultValue={['1', '2', '不存在的测试', '11', '12', '13', '14']}
          suffix={<DownOutlined />}
          data={[
            {
              id: '1',
              title: 'title1',
            },
            {
              id: '2',
              title: '二锅头',
            },
            {
              id: '3',
              title: '梦幻3',
            },
            {
              id: '4',
              title: '老四',
            },
            {
              id: '11',
              title: '1title1',
            },
            {
              id: '12',
              title: '1二锅头',
            },
            {
              id: '13',
              title: '1梦幻3',
            },
            {
              id: '14',
              title: '1老四',
            },
          ]}
        />
      </div>
    </>
  )
}
