import React from 'react'
import Grid from '../src'

const { Row, Col } = Grid

export const Nested = () => {
  const blockStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    textAlign: 'center',
    opacity: '0.8',
    color: '#fff',
  }

  return (
    <>
      <h1>Nested</h1>
      <div className="grid-nested__wrap" style={{ width: 764 }}>
        <Row gutter={true}>
          <Col span={16}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>
              col-16
              <Row gutter={8}>
                <Col span={12}>
                  <div style={{ ...blockStyle, backgroundColor: '#237ffa', opacity: 1 }}>
                    col-12
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ ...blockStyle, backgroundColor: '#237ffa', opacity: 1 }}>
                    col-12
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-4</div>
          </Col>
        </Row>
      </div>
    </>
  )
}
