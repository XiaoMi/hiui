import React from 'react'
import Grid from '../src'

/**
 * @title AutoGrid Nodes API
 * @desc 使用 nodes 替代 children，支持 props 对象或函数
 */
export const AutoGridNodes = () => {
  const { AutoGrid } = Grid

  const blockStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    textAlign: 'center',
    opacity: '1',
    color: '#fff',
  }

  const nodes = [
    { key: '1', elem: <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>1</div> },
    {
      key: '2',
      elem: <div style={{ ...blockStyle, backgroundColor: '#4b82ff' }}>2</div>,
      props: { span: 16 },
    },
    {
      key: '3',
      elem: <div style={{ ...blockStyle, backgroundColor: '#2660ff' }}>3</div>,
      props: ({ columnCount }: { columns: number; columnCount: number }) => ({
        span: 24,
      }),
    },
  ]

  return (
    <>
      <h1>可通过 nodes 属性自定义子元素的完整 Col 属性</h1>
      <div className="auto-grid-nodes__wrap">
        <AutoGrid nodes={nodes} gutter rowGap={16}></AutoGrid>
      </div>
    </>
  )
}
