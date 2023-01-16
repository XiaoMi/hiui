import React from 'react'
import NumberInput from '../src'

/**
 * @title 格式化用法,指定小数点精度
 * @desc 用于处理格式化输入
 */
export const Format = () => {
  return (
    <>
      <h1>NumberInput</h1>
      <div className="NumberInput-basic__wrap">
        <NumberInput
          autoFocus
          defaultValue={5}
          min={1}
          onChange={(v) => console.log('onChange', v)}
          blurFormatFunc={(v) => {
            return Number(formatNumber(v + '', 3))
          }}
        />
      </div>
    </>
  )
}

const formatNumber = (value: string, decimal: number = 0) => {
  const isNagivate: boolean = parseFloat(value) < 0
  const scaleNum: number = parseFloat(value) * Math.pow(10, decimal + 1)
  const roundNum: number = Math.round(scaleNum / 10)
  const intValueStr: string = Math.abs(roundNum) + ''
  const baseIntStr: string = intValueStr.substring(0, intValueStr.length - decimal)
  let intStr: string = baseIntStr === '' ? '0' : baseIntStr

  const initPieces: string[] = []
  while (intStr.length > 3) {
    initPieces.unshift(intStr.substr(intStr.length - 3))
    intStr = intStr.substr(0, intStr.length - 3)
  }
  if (intStr !== '') {
    initPieces.unshift(intStr)
  }

  const floatPiece: string = intValueStr.substring(intValueStr.length - decimal)
  const floatStr: string = floatPiece.replace(/0*$/, '')

  return (isNagivate ? '-' : '') + initPieces.join(',') + (floatStr === '' ? '' : '.' + floatStr)
}
