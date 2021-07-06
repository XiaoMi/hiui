import React from 'react'
import Checkbox, { CheckboxGroup } from '../src'

export const Basic = () => {
  const [selectedList, setSelectedList] = React.useState<React.ReactText[]>(['Phone'])

  return (
    <>
      <h1>Checkbox</h1>
      <div className="checkbox-basic__wrap">
        <div>
          <Checkbox indeterminate>半选</Checkbox>
        </div>

        <CheckboxGroup
          // placement="vertical"
          value={selectedList}
          onChange={(value) => {
            console.log(value)
            setSelectedList(value)
          }}
        >
          <Checkbox value="Phone">手机</Checkbox>
          <Checkbox value="Computer">电脑</Checkbox>
          <Checkbox value="Intelligent" disabled>
            智能
          </Checkbox>
          <Checkbox onChange={console.log} value="Transfer">
            出行
          </Checkbox>
        </CheckboxGroup>
      </div>
    </>
  )
}
