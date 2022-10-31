import React from 'react'
import Anchor, { AnchorItem } from '../src'

/**
 * @title 多级树形锚点
 * @desc 作为 `AnchorItem` 的子节点传入，扩展树形锚点的层级
 */
export const Children = () => {
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
      <h1>Children</h1>
      <div className="anchor-children__wrap" style={{ display: 'flex', minWidth: 660 }}>
        <Anchor style={{ width: 148 }} container={containerElement} offset={-20}>
          <AnchorItem href="#test-children-h1-1" title="容器化部署"></AnchorItem>
          <AnchorItem href="#test-children-h1-2" title="主要优点"></AnchorItem>
          <AnchorItem href="#test-children-h1-3" title="部署前准备">
            <AnchorItem href="#test-children-h1-4" title="申请部署空间"></AnchorItem>
            <AnchorItem href="#test-children-h1-5" title="CI变量配置"></AnchorItem>
          </AnchorItem>
          <AnchorItem href="#test-children-h1-6" title="发布模拟"></AnchorItem>
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
          <h2 id="test-children-h1-1">容器化部署</h2>
          {scrollAreaNode}
          <h2 id="test-children-h1-2">主要优点</h2>
          {scrollAreaNode}
          <h2 id="test-children-h1-3">部署前准备</h2>
          {scrollAreaNode}
          <h3 id="test-children-h1-4">申请部署空间</h3>
          {scrollAreaNode}
          <h3 id="test-children-h1-5">CI变量配置</h3>
          <div style={{ height: 300 }}></div>
          <h2 id="test-children-h1-6">发布模拟</h2>
          {scrollAreaNode}
        </div>
      </div>
    </>
  )
}
