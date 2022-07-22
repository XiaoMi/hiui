import React from 'react'
import Radio from '../src'
import Grid from '@hi-ui/grid'

/**
 * @title 灵活布局
 * @desc Radio 与 Grid 组件一起使用，可以实现灵活的布局
 */
export const Children = () => {
  const { Row, Col } = Grid
  const RadioGroup = Radio.Group

  const [selectedId, setSelectedId] = React.useState<React.ReactText>('Phone')

  return (
    <>
      <h1>Children</h1>
      <div className="radio-children__wrap">
        <RadioGroup
          value={selectedId}
          style={{ width: '100%' }}
          onChange={(value) => {
            console.log(value)
            setSelectedId(value)
          }}
        >
          <Row>
            <Col span={8}>
              <Radio value="Phone">手机</Radio>
            </Col>
            <Col span={8}>
              <Radio value="Computer">电脑</Radio>
            </Col>
            <Col span={8}>
              <Radio value="Intelligent">智能</Radio>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Radio value="Transfer" onChange={console.log}>
                出行
              </Radio>
            </Col>
            <Col span={8}>
              <Radio value="ecological" onChange={console.log}>
                生态
              </Radio>
            </Col>
          </Row>
        </RadioGroup>
      </div>
    </>
  )
}
