import React from 'react'
import Grid from '../src'

/**
 * @title 区块间隔
 * @desc 在 Row 设置 gutter = true 来使水平排列有间隔
 */
export const Gutter = () => {
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
      <h1>Gutter</h1>
      <div className="grid-gutter__wrap">
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
