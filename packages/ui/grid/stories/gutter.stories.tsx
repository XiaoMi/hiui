import React from 'react'
import Grid from '../src'

const { Row, Col } = Grid

export const Gutter = () => {
  const blockStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    textAlign: 'center',
    opacity: '0.8',
    color: '#fff',
  }

  return (
    <>
      <h1>Gutter</h1>
      <div className="grid-gutter__wrap" style={{ width: 764 }}>
        <Row gutter={true}>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>
              col-6
              <br />
              25%
            </div>
          </Col>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>
              col-6
              <br />
              25%
            </div>
          </Col>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>
              col-6
              <br />
              25%
            </div>
          </Col>
          <Col span={6}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>
              col-6
              <br />
              25%
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}
