import React from 'react'
import CheckSelect from '../src'

/**
 * @title 展示全部已选项
 * @desc 设置后，选中内容超出宽度时会换行展示
 */
export const TagInputWrap = () => {
  const [data] = React.useState([
    { title: '手机', id: '1' },
    { title: '电脑', id: '2' },
    { title: '电视', id: '3' },
    { title: '平板', id: '4' },
    { title: '冰箱', id: '5' },
    { title: '洗衣机', id: '6' },
    { title: '空调', id: '7' },
    { title: '其它', id: '8' },
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
