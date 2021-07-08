import React, { useState } from 'react'

import Tag from '../src'

export const Basic = () => {
  const [list, setList] = useState<string[]>(['Round editable', 'Round linear editable'])

  const onEdit = (content: string, index: number) => {
    setList((pre) => {
      const result = [...pre]
      result[index] = content
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
        <Tag color="#46bc99" editable onEdit={(e) => onEdit(e, 0)}>
          {list[0]}
        </Tag>
        <Tag color="#46bc99" appearance="line" editable onEdit={(e) => onEdit(e, 0)}>
          {list[0]}
        </Tag>
      </div>
    </>
  )
}
