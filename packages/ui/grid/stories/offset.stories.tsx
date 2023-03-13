import React from 'react'
import Grid from '../src'

/**
 * @title 左右偏移
 * @desc 设置 offset 来指定左右的偏移量
 */
export const Offset = () => {
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
      <h1>Offset</h1>
      <div className="grid-offset__wrap">
        <Row gutter={true}>
          <Col span={8}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-8</div>
          </Col>
          <Col span={6} offset={6}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>col-6-offset-6</div>
          </Col>
          <Col span={4}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-4</div>
          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={4}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-4</div>
          </Col>
          <Col span={6} offset={4}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>col-6-offset-4</div>
          </Col>
          <Col span={4}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-4</div>
          </Col>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-6</div>
          </Col>
        </Row>
      </div>
    </>
  )
}
