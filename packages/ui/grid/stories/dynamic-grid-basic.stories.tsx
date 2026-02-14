import React, { useState } from 'react'
import Grid from '../src'

/**
 * @title DynamicGrid 基础
 * @desc 可拖拽容器调整宽度，根据 breakpoints 自动调整列数，onColumnCountChange 回调当前列数
 */
export const DynamicGridBasic = () => {
  const { DynamicGrid } = Grid
  const [count, setCount] = useState<number>(0)

  const blockStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    textAlign: 'center',
    opacity: '1',
    color: '#fff',
  }

  const resizeStyle: React.CSSProperties = {
    resize: 'horizontal',
    overflow: 'auto',
    width: 500,
    minWidth: 300,
    maxWidth: 860,
    border: '2px dashed #e5e7eb',
    borderRadius: 8,
    padding: 16,
  }

  const breakpoints: [number, number][] = [
    [400, 1],
    [600, 2],
    [Infinity, 3],
  ]

  console.log('count', count)

  return (
    <>
      <h1>DynamicGridBasic</h1>
      <div className="grid-dynamic-basic__wrap">
        <div style={resizeStyle}>
          <DynamicGrid
            breakpoints={breakpoints}
            onColumnCountChange={(count) => {
              console.log('onColumnCountChange', count)
              setCount(count)
            }}
            gutter
            rowGap={16}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{ ...blockStyle, backgroundColor: i % 2 ? '#2660ff' : '#4b82ff' }}
              >
                Item {i}
              </div>
            ))}
          </DynamicGrid>
        </div>
        <p style={{ marginTop: 16, color: '#666' }}>
          可拖拽容器右侧边缘调整宽度，观察列数自动变化，当前列数: {count || '-'}
        </p>
      </div>
    </>
  )
}
