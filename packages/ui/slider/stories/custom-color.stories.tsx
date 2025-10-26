import React from 'react'
import Slider from '../src'

/**
 * @title 自定义颜色
 * @desc 自定义滑块条的颜色
 */
export const CustomColor = () => {
  const colorMap = [
    {
      color: '#237ffa',
      type: 'primary',
    },
    {
      color: '#ff5959',
      type: 'danger',
    },
    {
      color: '#14ca64',
      type: 'success',
    },
    {
      color: '#fab007',
      type: 'warning',
    },
  ]

  const [type, setType] = React.useState('primary')
  return (
    <>
      <h1>CustomColor</h1>
      <div className="slider-custom-color__wrap">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {colorMap.map((item) => (
            <span
              style={{
                width: 25,
                height: 22,
                marginRight: 12,
                background: item.color,
                display: 'inline-block',
                cursor: 'pointer',
                boxShadow: type === item.type ? '0px 2px 4px 0px rgba(0,0,0,0.5)' : 'none',
              }}
              onClick={() => {
                setType(item.type)
              }}
              key={item.color}
            ></span>
          ))}
        </div>
        <Slider color={colorMap.find((item) => item.type === type)?.color} />
      </div>
    </>
  )
}
