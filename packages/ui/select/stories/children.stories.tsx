import React from 'react'
import Select from '../src'
import { SelectOptionGroup } from '../src/SelectOptionGroup'
import { SelectOption } from '../src/SelectOption'

/**
 * @private
 */
export const Children = () => {
  const [value, setValue] = React.useState<React.ReactText>('jack')

  return (
    <>
      <h1>Children</h1>
      <div className="select-children__wrap">
        <Select style={{ width: 200 }} value={value} onChange={setValue}>
          <SelectOptionGroup key="Manager" label="Manager" style={{ color: '#ccc' }}>
            <SelectOption value="lucy">Lucy</SelectOption>
            <SelectOption value="jack">Jack</SelectOption>
          </SelectOptionGroup>
          <SelectOptionGroup key="Engineer" label="Engineer">
            <SelectOption value="tony">yiminghe</SelectOption>
          </SelectOptionGroup>
        </Select>
      </div>
    </>
  )
}
