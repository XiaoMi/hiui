import React from 'react'
import Checkbox from '../src'
import { Row, Col } from '@hi-ui/grid'

export const Children = () => {
  const CheckboxGroup = Checkbox.Group

  const [selectedList, setSelectedList] = React.useState<React.ReactText[]>([
    'Phone',
    'Intelligent',
  ])

  return (
    <>
      <h1>Children</h1>
      <div className="checkbox-children__wrap">
        <CheckboxGroup
          value={selectedList}
          style={{ width: '100%' }}
          onChange={(value) => {
            console.log(value)
            setSelectedList(value)
          }}
        >
          <Row>
            <Col span={8}>
              <Checkbox value="Phone">手机</Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="Computer">电脑</Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="Intelligent">智能</Checkbox>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Checkbox value="Transfer" onChange={console.log}>
                出行
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="ecological" onChange={console.log}>
                生态
              </Checkbox>
            </Col>
          </Row>
        </CheckboxGroup>
      </div>
    </>
  )
}
