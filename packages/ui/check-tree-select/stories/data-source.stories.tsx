import React from 'react'
import CheckTreeSelect from '../src'

/**
 * @title 异步加载数据
 * @desc 备选项数量较大时，通过搜索选项关键词调取存储于服务端的数据备选项
 */
export const DataSource = () => {
  const [data] = React.useState([
    {
      title: '手机类',
      id: '0',
      children: [
        {
          title: 'Redmi系列',
          id: '0-0',
          disabled: true,
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

  return (
    <>
      <h1>DataSource</h1>
      <div className="check-tree-select-data-source__wrap">
        <CheckTreeSelect
          style={{ width: 240 }}
          data={[]}
          dataSource={(keyword) => {
            return new Promise((resolve) => {
              // 递归过滤所有嵌套子节点，保留匹配的分支
              function filterTree(nodes: any[]): any[] {
                return nodes
                  .map((node: any) => {
                    if (node.children) {
                      const filteredChildren = filterTree(node.children)
                      if (node.title.includes(keyword) || filteredChildren.length > 0) {
                        return { ...node, children: filteredChildren }
                      }
                    } else if (node.title.includes(keyword)) {
                      return node
                    }
                    return null
                  })
                  .filter(Boolean)
              }
              const filteredData = filterTree(data)

              setTimeout(() => {
                resolve(filteredData)
              }, 1000)
            })
          }}
          checkedMode="PARENT"
          onChange={console.log}
        />
      </div>
    </>
  )
}
