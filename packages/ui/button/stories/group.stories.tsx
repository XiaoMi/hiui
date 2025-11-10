import React from 'react'
import { ButtonGroup, Button } from '../src'
import { EditOutlined } from '@hi-ui/icons'

/**
 * @title 按钮组
 * @desc 用于将有并列关系的一组动作，以组的形式展示
 */
export const Group = () => {
  return (
    <>
      <h1>按钮组</h1>
      <div className="button-basic__wrap" style={{ marginBottom: 20 }}>
        <ButtonGroup style={{ marginRight: 20 }}>
          <Button type="primary">按钮 1</Button>
          <Button type="primary">按钮 2</Button>
          <Button type="primary">按钮 3</Button>
        </ButtonGroup>
      </div>

      <div className="button-basic__wrap" style={{ marginBottom: 20 }}>
        <ButtonGroup style={{ marginRight: 20 }}>
          <Button type="primary" icon={<EditOutlined />} />
          <Button type="primary" icon={<EditOutlined />} />
          <Button type="primary" icon={<EditOutlined />} />
        </ButtonGroup>
      </div>

      <div className="button-basic__wrap" style={{ marginBottom: 20 }}>
        <ButtonGroup style={{ marginRight: 20 }}>
          <Button type="primary">按钮</Button>
          <Button type="primary" icon={<EditOutlined />} />
        </ButtonGroup>
      </div>
    </>
  )
}
