import React from 'react'
import { Row, Col } from '../src'

export const Offset = () => {
  const blockStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    textAlign: 'center',
    opacity: '.8',
    color: '#fff',
  }

  return (
    <>
      <h1>Offset</h1>
      <div className="grid-offset__wrap">
        <Row gutter={true}>
          <Col span={8}>
            <div style={{ ...blockStyle, backgroundColor: '#4284f5' }}>col-8</div>
          </Col>
          <Col span={6} offset={6}>
            <div style={{ ...blockStyle, backgroundColor: '#ff6700' }}>col-6-offset-6</div>
          </Col>
          <Col span={4}>
            <div style={{ ...blockStyle, backgroundColor: '#4284f5' }}>col-4</div>
          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={4}>
            <div style={{ ...blockStyle, backgroundColor: '#4284f5' }}>col-4</div>
          </Col>
          <Col span={6} offset={4}>
            <div style={{ ...blockStyle, backgroundColor: '#ff6700' }}>col-6-offset-4</div>
          </Col>
          <Col span={4}>
            <div style={{ ...blockStyle, backgroundColor: '#4284f5' }}>col-4</div>
          </Col>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#4284f5' }}>col-6</div>
          </Col>
        </Row>
      </div>
    </>
  )
}
