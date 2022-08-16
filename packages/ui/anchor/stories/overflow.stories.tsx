import React from 'react'
import Anchor, { AnchorItem } from '../src'

/**
 * @title 文本溢出
 * @desc 锚点文字不建议太长，超出会溢出展示
 */
export const Overflow = () => {
  const [containerElement, setContainerElement] = React.useState<HTMLDivElement | null>(null)

  const scrollAreaNode = (
    <div
      style={{
        backgroundColor: '#f5f7fa',
        textAlign: 'center',
        height: '400px',
        lineHeight: '400px',
        color: '#1f2733',
      }}
    >
      Scroll Area
    </div>
  )

  return (
    <>
      <h1>Overflow</h1>
      <div className="anchor-overflow__wrap" style={{ display: 'flex', minWidth: 660 }}>
        <Anchor style={{ width: 148 }} container={containerElement} offset={-20}>
          <AnchorItem href="#test-overflow-h1-1" title="一级目录1号"></AnchorItem>
          <AnchorItem href="#test-overflow-h1-2" title="一级目录2号"></AnchorItem>
          <AnchorItem href="#test-overflow-h1-3" title="一级目录3号"></AnchorItem>
          <AnchorItem href="#test-overflow-h1-4" title="一级目录4号字数较多字数较多"></AnchorItem>
          <AnchorItem href="#test-overflow-h1-5" title="一级目录5号"></AnchorItem>
        </Anchor>
        <div
          ref={setContainerElement}
          style={{
            overflow: 'scroll',
            maxHeight: 320,
            border: '1px solid #f5f7fa',
            padding: '0 24px',
            flex: 1,
          }}
        >
          <h2 id="test-overflow-h1-1">一级目录1号</h2>
          {scrollAreaNode}
          <h2 id="test-overflow-h1-2">一级目录2号</h2>
          {scrollAreaNode}
          <h2 id="test-overflow-h1-3">一级目录3号</h2>
          {scrollAreaNode}
          <h2 id="test-overflow-h1-4">一级目录4号字数较多字数较多</h2>
          {scrollAreaNode}
          <h2 id="test-overflow-h1-5">一级目录5号</h2>
          {scrollAreaNode}
        </div>
      </div>
    </>
  )
}
