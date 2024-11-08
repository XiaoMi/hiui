import React from 'react'
import CheckSelect from '../src'

/**
 * @title 展示全部已选项
 * @desc 设置后，选中内容超出宽度时会换行展示
 */
export const TagInputWrap = () => {
  const [data] = React.useState([
    { title: '手机', id: '2' },
    { title: '小米2', id: '2-1' },
    { title: '小米3', id: '2-2' },
    { title: '小米4', id: '2-3' },
    { title: '小米5', id: '2-4' },
    { title: '电脑', id: '3' },
    { title: '笔记本', id: '4' },
    {
      title: '生活周边超长文案展示超长文案展示超长文案展示超长文案展示超长文案展示',
      id: '5',
    },
    { title: '其它', id: '6' },
  ])

  return (
    <>
      <h1>展示全部已选项</h1>
      <div className="check-select-tag-input-wrap__wrap">
        <CheckSelect
          style={{ width: 240 }}
          placeholder="请选择"
          searchable
          clearable
          data={data}
          tagInputProps={{
            wrap: true,
          }}
        />
      </div>
    </>
  )
}
