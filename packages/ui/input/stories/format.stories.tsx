import React from 'react'
import Input from '../src'

/**
 * @title 格式化展示
 * @desc 通过受控 value 根据特定场景进行格式化展示输入框内值
 */
export const Format = () => {
  const [value, setValue] = React.useState('')

  const currency = {
    format(value) {
      return value.replace(/\d+/, (ret) => {
        return ret.replace(/(\d)(?=(\d{3})+$)/g, ($1) => $1 + ',')
      })
    },
    pure(valueString) {
      return valueString.replace(/[^\d|.]/g, '')
    },
  }

  return (
    <>
      <h1>格式化展示</h1>
      <div className="input-format__wrap">
        <h2>金额的千位分隔符</h2>
        <Input
          style={{ width: 250 }}
          placeholder="请输入"
          prefix="￥"
          value={currency.format(value)}
          onChange={(event, value) => {
            const nextValue = currency.pure(value)
            console.log(value, nextValue)
            setValue(nextValue)
          }}
        />
      </div>
    </>
  )
}
