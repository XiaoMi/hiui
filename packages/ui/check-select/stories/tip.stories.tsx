import React from 'react'
import CheckSelect from '../src'
import Tooltip from '@hi-ui/tooltip'
import Checkbox from '@hi-ui/checkbox'

/**
 * @title 带Tooltip提示
 */
export const Tip = () => {
  const [data] = React.useState([
    { title: '电视', id: '3', disabled: false },
    { title: '手机', id: '2' },
    { title: '笔记本', id: '4', disabled: false },
    { title: '生活周边超级长文案展示生活周边超级长文案展示', id: '5' },
    { title: '办公', id: '6' },
  ])

  return (
    <>
      <h1>Tip</h1>
      <div className="check-select-tip__wrap">
        <CheckSelect
          style={{ width: 240 }}
          clearable={false}
          data={data}
          render={(item) => {
            console.log(item)
            return (
              <Tooltip title={item.title} placement="right">
                <Checkbox
                  checked={item.checked}
                  disabled={item.disabled}
                  style={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </Checkbox>
              </Tooltip>
            )
          }}
        />
      </div>
    </>
  )
}
