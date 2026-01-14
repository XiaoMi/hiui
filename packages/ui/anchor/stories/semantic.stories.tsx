import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Anchor, { AnchorItem } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selectedAnchor, setSelectedAnchor] = useState<'root' | 'list' | 'ink' | 'link'>()
  const [selectedAnchorItem, setSelectedAnchorItem] = useState<'root' | 'link'>()
  const [containerElement, setContainerElement] = React.useState<HTMLDivElement | null>(null)

  const scrollAreaNode = (
    <div
      style={{
        backgroundColor: '#f5f7fa',
        textAlign: 'center',
        height: '500px',
        lineHeight: '400px',
        color: '#1f2733',
      }}
    >
      Scroll Area
    </div>
  )

  return (
    <>
      <h1>自定义样式</h1>
      <div className="anchor-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Anchor
                classNames={{
                  root: 'my-anchor__root',
                  list: 'my-anchor__list',
                  ink: 'my-anchor__ink',
                }}
                styles={{
                  [selectedAnchor as string]: {
                    outline: '1px solid #ffbe0a',
                  },
                }}
                container={containerElement}
                offset={-20}
              >
                <AnchorItem
                  styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
                  href="#test-semantic-h1-1"
                  title="容器化部署"
                ></AnchorItem>
                <AnchorItem
                  styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
                  href="#test-semantic-h1-2"
                  title="主要优点"
                ></AnchorItem>
                <AnchorItem
                  styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
                  href="#test-semantic-h1-3"
                  title="部署前准备"
                ></AnchorItem>
                <AnchorItem
                  styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
                  href="#test-semantic-h1-4"
                  title="发布模拟"
                ></AnchorItem>
                <AnchorItem
                  styles={{ [selectedAnchorItem as string]: { outline: '1px solid #ffbe0a' } }}
                  href="#test-semantic-h1-5"
                  title="其它部署方式"
                ></AnchorItem>
              </Anchor>
              <div
                ref={setContainerElement}
                style={{
                  overflow: 'scroll',
                  maxHeight: 520,
                  border: '1px solid #f5f7fa',
                  padding: '0 12px',
                  flex: 1,
                }}
              >
                <h2 id="test-semantic-h1-1">容器化部署</h2>
                {scrollAreaNode}
                <h2 id="test-semantic-h1-2">主要优点</h2>
                {scrollAreaNode}
                <h2 id="test-semantic-h1-3">部署前准备</h2>
                {scrollAreaNode}
                <h2 id="test-semantic-h1-4">发布模拟</h2>
                {scrollAreaNode}
                <h2 id="test-semantic-h1-5">其它部署方式</h2>
                {scrollAreaNode}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <h2>Anchor</h2>
            <List
              split={false}
              data={[
                {
                  title: 'root',
                  description: '根元素',
                },
                {
                  title: 'list',
                  description: '列表区域',
                },
                {
                  title: 'ink',
                  description: '指示器',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelectedAnchor(dataItem.title as any)
                    }}
                    onMouseLeave={() => {
                      setSelectedAnchor(undefined)
                    }}
                  >
                    <List.Item {...dataItem} />
                  </div>
                )
              }}
            />
            <h2>AnchorItem</h2>
            <List
              split={false}
              data={[
                {
                  title: 'root',
                  description: '根元素',
                },
                {
                  title: 'link',
                  description: '链接区域',
                },
              ]}
              render={(dataItem) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setSelectedAnchorItem(dataItem.title as any)
                    }}
                    onMouseLeave={() => {
                      setSelectedAnchorItem(undefined)
                    }}
                  >
                    <List.Item {...dataItem} />
                  </div>
                )
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}
