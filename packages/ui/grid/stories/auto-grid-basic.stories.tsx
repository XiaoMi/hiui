import React from 'react'
import Grid from '../src'

/**
 * @title AutoGrid 基础
 * @desc children / columnCount / data-span / gutter 用法
 */
export const AutoGridBasic = () => {
  const { AutoGrid } = Grid

  const blockStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    textAlign: 'center',
    opacity: '1',
    color: '#fff',
  }

  return (
    <>
      <h1>AutoGridBasic</h1>
      <div className="auto-grid-basic__wrap">
        <h2>children 默认 3 列</h2>
        <AutoGrid gutter rowGap={16}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ ...blockStyle, backgroundColor: i % 2 ? '#2660ff' : '#4b82ff' }}>
              Item {i}
            </div>
          ))}
        </AutoGrid>

        <h2>子元素可通过 span / data-span 自定义占据栅格数</h2>
        <AutoGrid columnCount={4} gutter rowGap={16}>
          <div style={{ ...blockStyle, backgroundColor: '#2660ff' }} data-span={12}>
            span 12
          </div>
          <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }} data-span={12}>
            span 12
          </div>
          <div style={{ ...blockStyle, backgroundColor: '#2660ff' }} data-span={8}>
            span 8
          </div>
          <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }} data-span={8}>
            span 8
          </div>
          <div style={{ ...blockStyle, backgroundColor: '#2660ff' }} data-span={8}>
            span 8
          </div>
        </AutoGrid>
      </div>
    </>
  )
}
