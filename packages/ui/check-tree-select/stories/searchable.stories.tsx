import React from 'react'
import CheckTreeSelect from '../src'

/**
 * @title 带搜索
 * @desc 选项数量较大，不熟悉数据的结构关系情况下，用搜索关键词的方式快速定位
 */
export const Searchable = () => {
  const [data] = React.useState([
    {
      title: '手机类',
      id: '0',
      disabled: true,
      children: [
        {
          title: 'Redmi系列',
          id: '0-0',
          children: [
            {
              id: '0-0-1',
              title: 'Redmi K30',
            },
            {
              id: '0-0-2',
              title: 'Redmi K30 Pro',
            },
            {
              id: '0-0-3',
              title: 'Redmi 10X 5G',
            },
            {
              id: '0-0-4',
              title: 'Redmi Note 8',
            },
            {
              id: '0-0-5',
              title: 'Redmi 9',
            },
            {
              id: '0-0-6',
              title: 'Redmi 9A',
            },
          ],
        },
        {
          title: '小米手机',
          id: '0-1',
          children: [
            {
              id: '0-1-1',
              title: '小米10 Pro',
            },
            {
              id: '0-1-2',
              title: '小米10',
            },
            {
              id: '0-1-3',
              title: '小米10 青春版 5G',
            },
            {
              id: '0-1-4',
              title: '小米MIX Alpha',
            },
          ],
        },
      ],
    },
    {
      title: '电视',
      id: '1',
      children: [
        {
          title: '小米电视 大师 65英寸OLED',
          id: '1-0',
        },
        {
          title: 'Redmi 智能电视 MAX 98',
          id: '1-1',
        },
        {
          title: '小米电视4A 60英寸',
          id: '1-2',
        },
      ],
    },
  ])

  // 注意 filterOption 是影响搜索渲染的，是完全受控的，useCallback 包裹可以减少无效的重渲染，提升性能
  const filterOptionMemo = React.useCallback((keyword: string, item: any) => {
    console.log(keyword, item)

    const match = (node: any) =>
      typeof node.title === 'string' && node.title.indexOf(keyword) !== -1

    const matchUp = (node: any) => {
      let found = match(node)
      const { children } = node

      if (children && !found) {
        found = children.some((item: any) => matchUp(item))
      }

      return found
    }

    return matchUp(item)
  }, [])

  return (
    <>
      <h1>Searchable</h1>
      <div className="tree-select-searchable__wrap">
        <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 10px 0' }}>
          highlight 仅高亮
        </div>
        <CheckTreeSelect
          style={{ width: 240 }}
          data={data}
          searchable
          searchMode="highlight"
          onChange={(checkedIds, options) => {
            console.log('CheckTreeSelect onChange: ', checkedIds, options)
          }}
        />

        <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 10px 0' }}>
          filter 高亮并且过滤无关节点
        </div>

        <CheckTreeSelect
          style={{ width: 240 }}
          data={data}
          searchable
          searchMode="filter"
          onChange={(checkedIds, options) => {
            console.log('CheckTreeSelect onChange: ', checkedIds, options)
          }}
        />

        <div style={{ fontSize: 16, fontWeight: 500, margin: '20px 0 10px 0' }}>
          filterOption 自定义搜索策略
        </div>
        <CheckTreeSelect
          style={{ width: 240 }}
          data={data}
          searchable
          filterOption={filterOptionMemo}
          onChange={(checkedIds, options) => {
            console.log('CheckTreeSelect onChange: ', checkedIds, options)
          }}
        />
      </div>
    </>
  )
}
