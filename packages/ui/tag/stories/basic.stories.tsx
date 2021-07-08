import React, { useState } from 'react'

import Tag, { TagGroupNode } from '../src'

export const Basic = () => {
  const [list, setList] = useState<TagGroupNode[]>([
    {
      id: 0,
      content: 'test',
      editable: true,
    },
    {
      id: 1,
      content: 'test',
      editable: true,
      appearance:'line'
    },
    {
      id: 2,
      content: 'test',
      editable: true,
      appearance:'line',
      type:'danger'
    },
  ])

  const onEdit = (content: string, index: number) => {
    setList((pre) => {
      const result = [...pre]
      result[index].content = content
      return result
    })
  }

  return (
    <>
      <h1>Tag</h1>
      <div className="tag-basic__wrap">
        <Tag>Round</Tag>
        <Tag shape="square">Square</Tag>
        <Tag appearance="line">Round line</Tag>
        <Tag appearance="line" shape="square">
          Square line
        </Tag>
        <Tag color="#ff5975">Round</Tag>
        <Tag shape="square" color="#ff5975">
          Square
        </Tag>
        <Tag appearance="line" color="#ff5975">
          Round line
        </Tag>
        <Tag appearance="line" shape="square" color="#ff5975">
          Square line
        </Tag>
        <Tag.TagGroup style={{ marginTop: '32px' }} onEdit={onEdit} editable data={list} />
      </div>
    </>
  )
}
