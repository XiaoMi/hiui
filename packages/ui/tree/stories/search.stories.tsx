import React from 'react'
import Tree, { useTreeSearch } from '../src'

export const Search = () => {
  const [SearchTree, searchInputProps] = useTreeSearch(Tree)

  return (
    <>
      <h1>Search for Tree</h1>
      <div className="tree-search__wrap">
        <div>
          <input type="text" {...searchInputProps} />
        </div>
        <SearchTree
          // searchable={true}
          // highlightText="米"
          data={[
            {
              id: 1,
              title: '小米',
              children: [
                {
                  id: 2,
                  title: '研发',
                  children: [
                    { id: 3, title: '后端' },
                    { id: 4, title: '运维' },
                    { id: 5, title: '前端' },
                  ],
                },
                { id: 6, title: '产品' },
              ],
            },
            {
              id: 11,
              title: '大米',
              children: [
                { id: 22, title: '可视化' },
                { id: 66, title: 'HiUI' },
              ],
            },
          ]}
        ></SearchTree>
      </div>
    </>
  )
}
