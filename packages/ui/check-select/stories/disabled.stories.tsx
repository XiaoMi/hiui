import React from 'react'
import CheckSelect, { CheckSelectOption, CheckSelectOptionGroup } from '../src'

export const Disabled = () => {
  return (
    <>
      <h1>Disabled</h1>
      <div className="check-select-basic__wrap">
        <CheckSelect placeholder="请选择" searchable disabled>
          <CheckSelectOptionGroup label="title1">
            <CheckSelectOption value="ABC1">Option-ABC1</CheckSelectOption>
            <CheckSelectOption value="ABC2">Option-ABC2</CheckSelectOption>
            <CheckSelectOption value="ABC3">Option-ABC3</CheckSelectOption>
          </CheckSelectOptionGroup>
          <CheckSelectOptionGroup label="title2">
            <CheckSelectOption value="ABC4">Option-ABC4</CheckSelectOption>
            <CheckSelectOption value="ABC5">Option-ABC5</CheckSelectOption>
            <CheckSelectOption value="ABC6">Option-ABC6</CheckSelectOption>
          </CheckSelectOptionGroup>
        </CheckSelect>
      </div>
    </>
  )
}
