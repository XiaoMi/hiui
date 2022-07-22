import React from 'react'
import Select from '../src'

import pinyinMatch from 'pinyin-match'

/**
 * @title 拼音搜索
 * @desc 通过输入拼音搜索关键字
 */
export const Pinyin = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边', id: '5' },
    { title: '办公', id: '6' },
  ])

  // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
  const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
    return !!pinyinMatch.match(item.title as string, keyword)
  }, [])

  return (
    <>
      <h1>Pinyin</h1>
      <div className="select-pinyin__wrap">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          filterOption={filterOptionMemo}
        />
      </div>
    </>
  )
}
