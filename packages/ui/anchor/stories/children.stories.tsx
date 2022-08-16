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
          <AnchorItem href="#容器化部署" title="容器化部署"></AnchorItem>
          <AnchorItem href="#主要优点" title="主要优点"></AnchorItem>
          <AnchorItem href="#部署前准备" title="部署前准备">
            <AnchorItem href="#申请部署空间" title="申请部署空间"></AnchorItem>
            <AnchorItem href="#CI变量配置" title="CI变量配置"></AnchorItem>
          </AnchorItem>
          <AnchorItem href="#发布模拟" title="发布模拟"></AnchorItem>
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
          <h2 id="容器化部署">容器化部署</h2>
          {scrollAreaNode}
          <h2 id="主要优点">主要优点</h2>
          {scrollAreaNode}
          <h2 id="部署前准备">部署前准备</h2>
          {scrollAreaNode}
          <h3 id="申请部署空间">申请部署空间</h3>
          {scrollAreaNode}
          <h3 id="CI变量配置">CI变量配置</h3>
          <div style={{ height: 300 }}></div>
          <h2 id="发布模拟">发布模拟</h2>
          {scrollAreaNode}
        </div>
      </div>
    </>
  )
}
