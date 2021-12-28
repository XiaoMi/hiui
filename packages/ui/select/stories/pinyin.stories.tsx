import React from 'react'
import Select from '../src'

import pinyinMatch from 'pinyin-match'

export const Pinyin = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>Pinyin</h1>
      <div className="select-pinyin__wrap">
        <Select
          clearable={false}
          style={{ width: 200 }}
          data={data}
          filterOption={(keyword, item) => {
            return !!pinyinMatch.match(item.title as string, keyword)
          }}
        />
      </div>
    </>
  )
}
