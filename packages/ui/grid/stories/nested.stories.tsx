import React from 'react'
import { Row, Col } from '../src'

export const Nested = () => {
  const blockStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    textAlign: 'center',
    opacity: '.8',
    color: '#fff',
  }

  return (
    <>
      <h1>Nested</h1>
      <div className="grid-nested__wrap">
        <Row gutter={true}>
          <Col span={16}>
            <div style={{ ...blockStyle, backgroundColor: '#ff6700' }}>
              col-16
              <Row gutter={true}>
                <Col span={12}>
                  <div style={{ ...blockStyle, backgroundColor: '#4284f5', opacity: 1 }}>
                    col-12
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ ...blockStyle, backgroundColor: '#4284f5', opacity: 1 }}>
                    col-12
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ ...blockStyle, backgroundColor: '#4284f5' }}>col-4</div>
          </Col>
        </Row>
      </div>
    </>
  )
}
