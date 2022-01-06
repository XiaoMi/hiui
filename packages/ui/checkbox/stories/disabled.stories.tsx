import React from 'react'
import Checkbox from '../src'

export const Disabled = () => {
  return (
    <>
      <h1>禁用态</h1>
      <div className="checkbox-disabled__wrap">
        <Checkbox disabled checked>
          复选框
        </Checkbox>
        <br />
        <br />
        <Checkbox disabled>复选框</Checkbox>
        <br />
        <br />
        <Checkbox disabled indeterminate>
          复选框
        </Checkbox>
      </div>
    </>
  )
}
