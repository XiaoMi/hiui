import React from 'react'
import { Row, Col } from '../src'

export const Justify = () => {
  const blockStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    textAlign: 'center',
    opacity: '0.8',
    color: '#fff',
  }

  return (
    <>
      <h1>Justify</h1>
      <div className="grid-justify" style={{ width: 764 }}>
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
