import React from 'react'
import NumberInput from '../src'

/**
 * @title 语义化样式设置
 * @desc 支持设置 input、prefix、suffix、handler 的样式
 */
export const Styles = () => {
  return (
    <>
      <h1>Styles</h1>
      <div className="NumberInput-basic__wrap">
        <NumberInput
          styles={{
            input: {
              textAlign: 'center',
            },
          }}
          classNames={{
            input: 'number-input-styles__input',
          }}
          defaultValue={5}
          min={1}
          placeholder="请输入数字"
          onChange={(v) => console.log('onChange', v)}
        />
      </div>
    </>
  )
}
