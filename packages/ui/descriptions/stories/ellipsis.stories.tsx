import React from 'react'
import Descriptions from '../src'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'

/**
 * @title 超出展示省略号
 * @desc Descriptions 配合 EllipsisTooltip 组件，形成超出展示省略号功能
 */
export const Ellipsis = () => {
  const data = [
    {
      // 超出宽度限制才会展示，没有超出不展示
      label: <EllipsisTooltip>满江红</EllipsisTooltip>,
      value: '怒发冲冠',
    },
    {
      label: <EllipsisTooltip>靖康耻，犹未雪。</EllipsisTooltip>,
      labelWidth: 100,
      value: '臣子恨，何时灭。臣子恨，何时灭。',
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
      labelWidth: 100,
      value: <EllipsisTooltip>收拾旧山河，收拾旧山河，收拾旧山河，收拾旧山河</EllipsisTooltip>,
    },
    {
      label: '朝天阙',
      value: '结束',
    },
  ]

  return (
    <>
      <h1>超出省略号</h1>
      <div className="descriptions-basic__wrap">
        <Descriptions data={data} />
      </div>
    </>
  )
}
