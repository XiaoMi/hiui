import React from 'react'
import Checkbox from '../src'
import Grid from '@hi-ui/grid'

/**
 * @title 灵活布局
 * @desc Checkbox 与 Grid 组件一起使用，可以实现灵活的布局
 */
export const Children = () => {
  const { Row, Col } = Grid
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
