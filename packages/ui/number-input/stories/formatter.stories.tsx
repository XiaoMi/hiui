import React from 'react'
import NumberInput from '../src'

/**
 * @title 格式化展示
 * @desc 自定义格式化展示
 */
export const Formatter = () => {
  const currency = {
    format(value: string) {
      return value.replace(/\d+/, (ret) => {
        return ret.replace(/(\d)(?=(\d{3})+$)/g, ($1) => $1 + ',')
      })
    },
    pure(valueString: string) {
      return valueString.replace(/[^\d|.]/g, '')
    },
  }

  function formatNumberPrecision(
    num: number,
    precision = 2,
    precisionMode: 'cut' | 'round' = 'round'
  ) {
    if (isNaN(num) || isNaN(precision)) {
      return num
    }

    let result: string | number = num

    if (precisionMode === 'round') {
      result = Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
      if (
        String(result).split('.').length === 1 ||
        String(result).split('.')[1].length < precision
      ) {
        return parseFloat(String(result)).toFixed(precision)
      }
    }

    if (precisionMode === 'cut') {
      if (String(result).split('.')[1]?.length > precision) {
        result = String(result).substring(0, String(result).indexOf('.') + precision + 1)
      }
      return parseFloat(String(result)).toFixed(precision)
    }

    return result
  }

  const [value, setValue] = React.useState(1234)

  return (
    <>
      <h1>NumberInput formatter</h1>
      <div className="NumberInput-formatter__wrap">
        <h2>千分位展示</h2>
        <NumberInput
          defaultValue={1234}
          min={1}
          formatter={(value) => currency.format(value + '')}
          parser={(value) => Number(currency.pure(value + ''))}
          onChange={(v) => console.log('onChange', v)}
        />
        <h2>千分位展示 受控</h2>
        <NumberInput
          value={value}
          min={1}
          formatter={(value) => currency.format(value + '')}
          parser={(value) => Number(currency.pure(value + ''))}
          onChange={(v) => {
            console.log('onChange', v)
            setValue(v)
          }}
        />
        <h2>小数点精度展示</h2>
        <NumberInput
          defaultValue={1234}
          min={1}
          formatter={(value) => formatNumberPrecision(Number(value), 2, 'cut')}
          onChange={(v) => console.log('onChange', v)}
        />
        <h2>小数点精度展示 受控</h2>
        <NumberInput
          value={value}
          min={1}
          formatter={(value) => formatNumberPrecision(Number(value), 2, 'round')}
          onChange={(v) => {
            console.log('onChange', v)
            setValue(v)
          }}
        />
      </div>
    </>
  )
}
