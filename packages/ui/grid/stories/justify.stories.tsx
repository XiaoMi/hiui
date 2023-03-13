import React from 'react'
import Grid from '../src'

/**
 * @title 对齐排列
 * @desc 设置 justify 来指定对齐方式
 */
export const Justify = () => {
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
      <h1>Justify</h1>
      <div className="grid-justify">
        <Row justify="center" gutter={true}>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-6</div>
          </Col>
        </Row>
        <Row justify="space-between" gutter={true}>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-6</div>
          </Col>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-6</div>
          </Col>
        </Row>
      </div>
    </>
  )
}
