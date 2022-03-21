import React, { useState } from 'react'
import Space from '../src'
import Button from '@hi-ui/button'
import Counter from '@hi-ui/counter'
import Switch from '@hi-ui/switch'

export const AutoSize = () => {
  const [size, setSize] = useState(8)
  const [checked, setChecked] = useState(false)
  const nextSize = checked ? [size + 6, size] : size

  return (
    <>
      <h1>自定义间距大小</h1>
      <div style={{ paddingBottom: 12 }}>
        <p>是否同时设置横向纵向间距</p>
        <Switch checked={checked} onChange={(checked) => setChecked(checked)} />
      </div>
      <p>间距调整</p>
      <Counter autoFocus value={size} min={0} onChange={(v) => setSize(v)} />
      <div className="space-basic__wrap" style={{ paddingTop: 12 }}>
        <Space size={nextSize} wrap>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
          <Button>HiUI Button</Button>
        </Space>
      </div>
    </>
  )
}
