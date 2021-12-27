import React, { useState } from 'react'
import { Tag, TagGroupNode } from '../src'

export const TagGroupStory = () => {
  const [baseData, setBaseData] = useState<TagGroupNode[]>([
    {
      children: 'Test',
      tagId: '0',
    },
  ])

  return (
    <>
      <h1>Tag group</h1>
      <h2>Base</h2>
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
                tagId: Math.random(),
              })
              return result
            })
          }
        }}
      />
    </>
  )
}
