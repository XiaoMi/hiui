import React from 'react'
import Switch from '../src'

/**
 * @title 不同大小
 */
export const Size = () => {
  return (
    <>
      <h1>Size</h1>
      <div className="switch-basic__wrap">
        <h2>sm</h2>
        <div>
          <Switch size="sm" defaultChecked content={['开', '关']} />
        </div>

        <h2>md</h2>
        <div>
          <Switch size="md" defaultChecked content={['开', '关']} />
        </div>

        <h2>lg</h2>
        <div>
          <Switch size="lg" defaultChecked content={['开', '关']} />
        </div>
      </div>
    </>
  )
}
