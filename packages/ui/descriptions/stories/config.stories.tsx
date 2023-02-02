import React from 'react'
import Descriptions from '../src'

/**
 * @title 通过Data 数组配置
 * @desc Descriptions 通过 data api 描述 Item 信息
 */
export const Config = () => {
  const data = [
    {
      label: '满江红',
      value: '怒发冲冠',
    },
    {
      label: '靖康耻，犹未雪',
      value: '臣子恨，何时灭',
    },
    {
      label: '驾长车',
      value: '踏破贺兰山缺',
    },
    {
      label: '壮志饥餐胡虏肉',
      value: '笑谈渴饮匈奴血',
    },
    {
      label: '待从头',
      value: '收拾旧山河',
    },
    {
      label: '朝天阙',
      value: '结束',
    },
  ]

  return (
    <>
      <h1>使用JS配置</h1>
      <div className="descriptions-basic__wrap">
        <Descriptions data={data} />
      </div>
    </>
  )
}
