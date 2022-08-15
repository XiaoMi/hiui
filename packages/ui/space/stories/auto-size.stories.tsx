import React, { useState } from 'react'
import Space from '../src'
import Button from '@hi-ui/button'
import Counter from '@hi-ui/counter'
import Switch from '@hi-ui/switch'

/**
 * @title 自定义间距大小
 * @desc 通过 size 设置数字开启自定义间距的大小，也支持数组分别设置纵横向间距
 */
export const AutoSize = () => {
  const [size, setSize] = useState(8)
  const [checked, setChecked] = useState(false)
  const nextSize = checked ? [size * 2, size] : size

  return (
    <>
      <h1>自定义间距大小</h1>
      <div className="space-basic__wrap">
        <Space direction="column" align="flex-start" size={12}>
          <div>是否同时设置2倍于横向间距的纵向间距</div>
          <Switch checked={checked} onChange={(checked) => setChecked(checked)} />

          <div>间距调整</div>
          <Counter value={size} min={0} onChange={(v) => setSize(v)} />

          <Space size={nextSize}>
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
        </Space>
      </div>
    </>
  )
}
