import React from 'react'
import Cascader from '../src'
import pinyinMatch from 'pinyin-match'

/**
 * @title 自定义搜索筛选规则
 */
export const FilterOptions = () => {
  const [data] = React.useState([
    {
      id: '手机',
      title: '手机t',
      children: [
        {
          id: '小米',
          title: '小米t',
          children: [
            {
              id: '小米3',
              title: '小米3t',
            },
            {
              id: '小米4',
              title: '小米4t',
            },
          ],
        },
        {
          id: '红米',
          title: '红米t',
          children: [
            {
              id: '红米3',
              title: '红米3t',
            },
            {
              id: '红米4',
              title: '红米4t',
            },
          ],
        },
      ],
    },
    {
      id: '电视',
      title: '电视t',
      children: [
        {
          id: '小米电视4A',
          title: '小米电视4At',
        },
        {
          id: '小米电视4C',
          title: '小米电视4Ct',
        },
      ],
    },
  ])

  return (
    <>
      <h1>FilterOptions</h1>
      <div className="select-filter-options__wrap">
        <Cascader
          clearable={false}
          style={{ width: 200 }}
          data={data}
          searchPlaceholder="拼音检索"
          filterOption={(keyword, item) => {
            return !!pinyinMatch.match(item.title as string, keyword)
          }}
        />
      </div>
    </>
  )
}
