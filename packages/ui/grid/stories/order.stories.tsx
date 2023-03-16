import React from 'react'
import Grid from '../src'

/**
 * @title 重排序
 * @desc 通过配置 order 优化 Grid 项的展示空间的排序位置
 */
export const Order = () => {
  const { Row, Col } = Grid

  const blockStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    textAlign: 'center',
    opacity: '1',
    color: '#fff',
  }

  return (
    <>
      <h1>Order</h1>
      <div className="grid-order__wrap">
        <Row>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>
              <div>1号空间</div>
              <div>序号：未定义</div>
            </div>
          </Col>
          <Col span={6} order={-1}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>
              <div>2号空间</div>
              <div>序号：-1</div>
            </div>
          </Col>
          <Col span={6} order={24}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>
              <div>3号空间</div>
              <div>序号：24</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>
              <div>4号空间</div>
              <div>序号：未定义</div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}
