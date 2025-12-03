import React from 'react'
import Select from '../src'

import { match } from 'pinyin-pro'

/**
 * @title 拼音搜索
 * @desc 通过输入拼音搜索关键字
 */
export const Pinyin = () => {
  const [data] = React.useState([
    { title: '手机', id: 'shouji' },
    { title: '电脑', id: 'diannao' },
    { title: '电视', id: 'dianshi' },
    { title: '洗衣机', id: 'xiyiji' },
    { title: '冰箱', id: 'bingxiang' },
    { title: '空调', id: 'kongtiao' },
    { title: '汽车', id: 'qiche' },
  ])

  // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
  const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
    return !!match(item.title as string, keyword)
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
