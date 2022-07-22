import React from 'react'
import Switch from '../src'

/**
 * @title 受控
 */
export const Controlled = () => {
  const [checked, setChecked] = React.useState(false)

  return (
    <>
      <h1>Controlled</h1>
      <div
        className="switch-controlled__wrap"
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <Switch checked={checked} onChange={setChecked} />
        <Switch checked={checked} onChange={setChecked} />
      </div>
    </>
  )
}
