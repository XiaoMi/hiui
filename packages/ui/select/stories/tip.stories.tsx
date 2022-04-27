import React from 'react'
import Select from '../src'
import Tooltip from '@hi-ui/tooltip'

/**
 * @title 带Tooltip提示
 */
export const Tip = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: true },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: true },
    { title: '生活周边超级长文案展示生活周边超级长文案展示', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>Tip</h1>
      <div className="select-Tip__wrap">
        <Select
          clearable={false}
          style={{ width: 200 }}
          data={data}
          render={(item) => {
            console.log(item)
            return (
              <Tooltip title={item.title} placement="right">
                <span
                  style={{
                    width: '100%',
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </span>
              </Tooltip>
            )
          }}
        />
      </div>
    </>
  )
}
