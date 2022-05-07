import React from 'react'
import Progress from '../src'
import Counter from '@hi-ui/counter'

/**
 * @title 自定义进度
 * @desc 设置组件和进度条的配合使用
 */
export const CustomPercent = () => {
  const [percent, setPercent] = React.useState(0)

  return (
    <>
      <h1>条形进度条</h1>
      <div className="progress-custom-percent__wrap">
        <Progress percent={percent} size="lg" />
        <br />
        <Counter
          value={percent}
          step={10}
          min={0}
          max={100}
          onChange={(percent) => {
            setPercent(percent)
          }}
        />
      </div>
    </>
  )
}
