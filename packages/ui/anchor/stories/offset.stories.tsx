import React from 'react'
import Anchor, { AnchorItem } from '../src'

/**
 * @title 设置滚动偏移量
 * @desc 通过 `offset` 指定锚点节点触发的滚动偏移量，负值表示提前触发
 */
export const Offset = () => {
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
      <h1>Offset</h1>
      <div className="anchor-offset__wrap" style={{ display: 'flex', minWidth: 660 }}>
        <Anchor style={{ width: 148 }} container={containerElement} offset={-20}>
          <AnchorItem href="#test-offset-h1-1" title="容器化部署"></AnchorItem>
          <AnchorItem href="#test-offset-h1-2" title="主要优点" offset={-100}></AnchorItem>
          <AnchorItem href="#test-offset-h1-3" title="部署前准备"></AnchorItem>
          <AnchorItem href="#test-offset-h1-4" title="发布模拟"></AnchorItem>
          <AnchorItem href="#test-offset-h1-5" title="其它部署方式"></AnchorItem>
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
          <h2 id="test-offset-h1-1">容器化部署</h2>
          {scrollAreaNode}
          <h2 id="test-offset-h1-2">主要优点</h2>
          {scrollAreaNode}
          <h2 id="test-offset-h1-3">部署前准备</h2>
          {scrollAreaNode}
          <h2 id="test-offset-h1-4">发布模拟</h2>
          {scrollAreaNode}
          <h2 id="test-offset-h1-5">其它部署方式</h2>
          {scrollAreaNode}
        </div>
      </div>
    </>
  )
}
