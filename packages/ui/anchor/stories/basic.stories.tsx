import React from 'react'
import Anchor, { AnchorItem } from '../src'

export const Basic = () => {
  const [containerElement, setContainerElement] = React.useState<HTMLDivElement | null>(null)
  console.log('containerElement', containerElement)

  return (
    <>
      <h1>Basic</h1>
      <div className="anchor-basic__wrap">
        <Anchor container={containerElement} offset={-20}>
          <AnchorItem href="#前端资源容器化部署" title="前端资源容器化部署"></AnchorItem>
          <AnchorItem href="#主要优点" title="主要优点"></AnchorItem>
          <AnchorItem href="#部署前准备" title="部署前准备"></AnchorItem>
          <AnchorItem href="#发布模拟" title="发布模拟"></AnchorItem>
          <AnchorItem href="#其它部署方式" title="其它部署方式"></AnchorItem>
        </Anchor>
        <div
          ref={setContainerElement}
          style={{ overflow: 'scroll', maxHeight: 600, border: '1px solid #ccc' }}
        >
          <h2
            id="前端资源容器化部署"
            style={{ boxSizing: 'border-box', borderTop: '1px solid #ccc', margin: 0 }}
          >
            前端资源容器化部署
          </h2>
          <div style={{ height: 800 }}></div>
          <h2 id="主要优点" style={{ boxSizing: 'border-box', borderTop: '1px solid #ccc' }}>
            主要优点
          </h2>
          <div style={{ height: 800 }}></div>
          <h2 id="部署前准备" style={{ boxSizing: 'border-box', borderTop: '1px solid #ccc' }}>
            部署前准备
          </h2>
          <div style={{ height: 800 }}></div>
          <h2 id="发布模拟" style={{ boxSizing: 'border-box', borderTop: '1px solid #ccc' }}>
            发布模拟
          </h2>
          <div style={{ height: 800 }}></div>
          <h2 id="其它部署方式" style={{ boxSizing: 'border-box', borderTop: '1px solid #ccc' }}>
            其它部署方式
          </h2>
          <div style={{ height: 800 }}></div>
        </div>
      </div>
    </>
  )
}
