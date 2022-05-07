import React from 'react'
import Provider from '../src'
import Alert from '@hi-ui/alert'

/**
 * @title 基础用法
 */
export const Basic = () => {
  return (
    <>
      <h1>使用须知</h1>
      <div className="provider-basic__wrap">
        <Alert title="在 APP 最外层包裹使用，用于主色、国际化、圆角、边框、特效等主题设置"></Alert>
        <Provider locale="en-US" theme={{}} accentColor="brandblue"></Provider>
      </div>
    </>
  )
}
