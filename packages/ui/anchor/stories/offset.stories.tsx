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
          <AnchorItem href="#容器化部署" title="容器化部署"></AnchorItem>
          <AnchorItem href="#主要优点" title="主要优点" offset={-100}></AnchorItem>
          <AnchorItem href="#部署前准备" title="部署前准备"></AnchorItem>
          <AnchorItem href="#发布模拟" title="发布模拟"></AnchorItem>
          <AnchorItem href="#其它部署方式" title="其它部署方式"></AnchorItem>
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
          <h2 id="发布模拟">发布模拟</h2>
          {scrollAreaNode}
          <h2 id="其它部署方式">其它部署方式</h2>
          {scrollAreaNode}
        </div>
      </div>
    </>
  )
}
