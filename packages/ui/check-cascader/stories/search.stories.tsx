import React from 'react'
import CheckCascader, { CheckCascaderDataItem } from '../src'

/**
 * @title 带搜索
 * @desc 选项数量较大，不熟悉数据的结构关系情况下，用搜索关键词的方式快速定位
 */
export const Search = () => {
  const [dataOnlyLeafCheckable] = React.useState(() => {
    const data = [
      {
        id: 'up-1',
        title: 'up',
        children: [
          {
            id: 'up-1-0',
            title: '小米',
            children: [
              {
                id: 'up-1-0-0',
                title: 'leaf',
              },
            ],
          },
          {
            id: 'up-1-1',
            title: '1-1',
          },
        ],
      },
      {
        id: '0',
        title: '0',
        children: [
          {
            id: '0-0',
            title: '0-0',
            children: [
              {
                id: '0-0-0',
                title: '0-0-0',
              },
              {
                id: '0-0-1',
                title: '0-0-1',
              },
              {
                id: '0-0-2',
                title: '0-0-2',
              },
            ],
          },
          {
            id: '0-1',
            title: '0-1',
            checkable: true,
            children: [
              {
                id: '0-1-0',
                title: '0-1-0',
              },
              {
                id: '0-1-1',
                title: '0-1-1',
              },
            ],
          },
          {
            id: '0-2',
            title: '0-2',
            checkable: true,
            children: [
              {
                id: '0-2-0',
                title: '0-2-0',
              },
              {
                id: '0-2-1',
                title: '0-2-1',
              },
            ],
          },
          {
            id: '0-3',
            title: '0-3',
            children: [
              {
                id: '0-3-0',
                title: '0-3-0',
              },
              {
                id: '0-3-1',
                title: '0-3-1',
              },
              {
                id: '0-3-2',
                title: '0-3-2',
              },
            ],
          },
          {
            id: '0-4',
            title: '0-4',
            checkable: true,
            children: [
              {
                id: '0-4-0',
                title: '0-4-0',
              },
              {
                id: '0-4-1',
                title: '0-4-1',
              },
            ],
          },
          {
            id: '0-5',
            title: '0-5',
            checkable: true,
            children: [
              {
                id: '0-5-0',
                title: '0-5-0',
              },
              {
                id: '0-5-1',
                title: '0-5-1',
              },
            ],
          },
          {
            id: '0-6',
            title: '0-6',
            children: [
              {
                id: '0-6-0',
                title: '0-6-0',
              },
              {
                id: '0-6-1',
                title: '0-6-1',
              },
              {
                id: '0-6-2',
                title: '0-6-2',
              },
            ],
          },
          {
            id: '0-7',
            title: '0-7',
            checkable: true,
            children: [
              {
                id: '0-7-0',
                title: '0-7-0',
              },
              {
                id: '0-7-1',
                title: '0-7-1',
              },
            ],
          },
          {
            id: '0-8',
            title: '0-8',
            checkable: true,
            children: [
              {
                id: '0-8-0',
                title: '0-8-0',
              },
              {
                id: '0-8-1',
                title: '0-8-1',
              },
            ],
          },
        ],
      },
      {
        id: '1',
        title: '1',
        children: [
          {
            id: '1-0',
            title: '1-0',
          },
          {
            id: '1-1',
            title: '1-1',
          },
        ],
      },
      {
        id: '2',
        title: '2',
        children: [
          {
            id: '2-0',
            title: '2-0',
          },
          {
            id: '2-1',
            title: '2-1',
          },
        ],
      },
    ]

    const getDataOnlyLeafCheckable = (data: CheckCascaderDataItem[]) => {
      return data.map((item: CheckCascaderDataItem) => {
        if (item.children) {
          item.checkable = item.checkable ?? false
          item.children = getDataOnlyLeafCheckable(item.children)
        } else {
          item.checkable = true
        }

        return item
      })
    }

    const dataOnlyLeafCheckable = getDataOnlyLeafCheckable(data)

    return dataOnlyLeafCheckable
  })

  console.log(dataOnlyLeafCheckable)

  return (
    <>
      <h1>Search</h1>
      <div className="cascader-search__wrap">
        <h2>展示搜索结果：拍平模式（默认）</h2>
        <CheckCascader
          style={{ width: 240 }}
          placeholder="请选择品类"
          searchPlaceholder="请输入搜索内容"
          data={dataOnlyLeafCheckable}
          searchable
        />
        <h2>展示搜索结果：级联模式</h2>
        <CheckCascader
          style={{ width: 240 }}
          placeholder="请选择品类"
          searchPlaceholder="请输入搜索内容"
          data={dataOnlyLeafCheckable}
          searchable
          flattedSearchResult={false}
        />
      </div>
    </>
  )
}
