import React, { useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts'

import DefaultTheme from './hi-echarts-theme-default.json'

const Charts = (props) => {
  useEffect(() => {
    echarts.registerTheme('default', DefaultTheme)
  }, [])
  return (
    <ReactEcharts
      {...props}
      theme={DefaultTheme}
    />
  )
}

export default Charts
