import React, { useState } from 'react'
import Tag, { TagGroupDataItem } from '../src'

/**
 * @title 标签组用法
 * @desc 以标签为信息实体进行编辑操作，如品类、频道等管理
 */
export const TagGroup = () => {
  const [baseData, setBaseData] = useState<TagGroupDataItem[]>([
    {
      children: 'Test',
      id: '0',
    },
  ])

  return (
    <>
      <h1>Tag group</h1>
      <Tag.Group
        data={baseData}
        onEdit={(newString, node, index) => {
          setBaseData((pre) => {
            const result = [...pre]
            result[index].children = newString
            return result
          })
        }}
        onDelete={(e, index) => {
          setBaseData((pre) => {
            const result = [...pre]
            result.splice(index, 1)
            return result
          })
        }}
        onAdd={(e) => {
          if (e) {
            setBaseData((pre) => {
              const result = [...pre]
              result.push({
                children: e,
                id: Math.random(),
              })
              return result
            })
          }
        }}
      />
    </>
  )
}
