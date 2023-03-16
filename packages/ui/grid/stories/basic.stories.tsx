import React from 'react'
import Grid from '../src'

/**
 * @title 基础用法
 * @desc 无间隔水平排列
 */
export const Basic = () => {
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
      <h1>Basic</h1>
      <div className="grid-basic__wrap">
        <Row>
          <Col span={24}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>col-24</div>
          </Col>
        </Row>
        <Row>
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
