import React from 'react'
import Cascader from '../src'
import pinyinMatch from 'pinyin-match'

/**
 * @title 自定义搜索筛选规则
 * @desc 通过 filterOption 可自定义搜索条件的算法
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

  // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
  const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
    if (item.children) return false
    const match = (node: any) =>
      typeof node.title === 'string' && !!pinyinMatch.match(node.title as string, keyword)

    const matchUp = (node: any) => {
      let found = match(node)
      let { parent } = node

      if (parent && !found) {
        const ancestors = [] as any[]
        while (parent) {
          ancestors.push(parent)
          parent = parent.parent
        }

        found = ancestors.some((item: any) => match(item))
        console.log(ancestors, found)
      }

      return found
    }

    const matchDown = (node: any) => {
      let found = match(node)
      const { children } = node

      if (children && !found) {
        found = children.some((item: any) => matchDown(item))
      }

      return found
    }

    const result = matchUp(item) || matchDown(item)

    return result
  }, [])

  return (
    <>
      <h1>FilterOptions</h1>
      <div className="select-filter-options__wrap">
        <Cascader
          style={{ width: 240 }}
          clearable={false}
          data={data}
          searchPlaceholder="拼音检索"
          filterOption={filterOptionMemo}
        />
      </div>
    </>
  )
}
