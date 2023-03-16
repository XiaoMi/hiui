import React from 'react'
import Grid from '../src'

/**
 * @title 响应式
 * @desc 配置 span 在不同屏幕宽度下所包含的栅格数，支持 { xs, sm, md, lg, xl } 设置。请通过改变窗口宽度查看示例效果
 */
export const Responsive = () => {
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
      <h1>Responsive</h1>
      <div className="grid-responsive__wrap">
        <h2>span</h2>
        <Row>
          <Col span={{ xs: 24, md: 12, lg: 6 }}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>.xs-24 .md-12 .lg-6</div>
          </Col>
          <Col span={{ xs: 24, md: 12, lg: 6 }}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>.xs-24 .md-12 .lg-6</div>
          </Col>
          <Col span={{ xs: 24, md: 12, lg: 6 }}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>.xs-24 .md-12 .lg-6</div>
          </Col>
          <Col span={{ xs: 24, md: 12, lg: 6 }}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>.xs-24 .md-12 .lg-6</div>
          </Col>
        </Row>

        <h2>offset</h2>
        <Row>
          <Col span={{ xs: 12, md: 8 }}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>.xs-12 .md-8</div>
          </Col>
          <Col span={{ xs: 12, md: 8 }} offset={{ xs: 6, md: 0 }}>
            <div style={{ ...blockStyle, backgroundColor: '#fab007' }}>xs-12 .md-8</div>
          </Col>
          <Col span={{ xs: 12, md: 8 }} offset={{ xs: 12, md: 0 }}>
            <div style={{ ...blockStyle, backgroundColor: '#237ffa' }}>xs-12 .md-8</div>
          </Col>
        </Row>
      </div>
    </>
  )
}
