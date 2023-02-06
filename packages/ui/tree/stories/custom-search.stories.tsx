import React from 'react'
import Tree, { useTreeSearchProps } from '../src'
import Input from '@hi-ui/input'
import Button from '@hi-ui/button'

/**
 * @title 自定义搜索 UI
 * @desc 通过 useTreeSearchProps 复用搜索逻辑，搜索 UI 交互展示完全自定义
 */
export const CustomSearch = () => {
  const [data] = React.useState([
    {
      id: '1',
      title: '小米',
      children: [
        {
          id: '2',
          title: '研发',
          children: [
            { id: '3', title: '后端' },
            { id: '4', title: '运维' },
            { id: '5', title: '前端' },
          ],
        },
        { id: '6', title: '产品' },
      ],
    },
    {
      id: '11',
      title: '大米',
      children: [
        { id: '22', title: '可视化' },
        { id: '66', title: 'HiUI' },
      ],
    },
  ])

  const [searchValue, setSearchValue] = React.useState('')
  const { filterTree, isEmpty, treeProps } = useTreeSearchProps({
    searchable: true,
    searchPlaceholder: '搜索',
    data,
    // checkable: true,
  })

  return (
    <>
      <h1>CustomSearch for Tree</h1>
      <div className="tree-custom-search__wrap">
        <Input
          value={searchValue}
          onChange={(evt) => setSearchValue(evt.target.value)}
          placeholder="请输入要查询的岗位"
        />
        <Button
          style={{ margin: '12px 0' }}
          onClick={() => {
            filterTree(searchValue)
          }}
        >
          点击搜索岗位
        </Button>
        <div style={{ fontSize: 14, color: '#5f6a7a' }}>
          我是提示：{isEmpty ? '暂时匹配不到相关岗位信息' : '无'}
        </div>
        <Tree {...treeProps} onCheck={console.log} />
      </div>
    </>
  )
}
