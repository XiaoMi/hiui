import React from 'react'
import Radio from '../src'
import { Row, Col } from '@hi-ui/grid'

export const Children = () => {
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
