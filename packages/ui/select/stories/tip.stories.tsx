import React from 'react'
import Select from '../src'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'

/**
 * @title 带Tooltip提示
 */
export const Tip = () => {
  const [data] = React.useState([
    { title: '手机', id: 'shouji' },
    { title: '电脑', id: 'diannao' },
    { title: '电视', id: 'dianshi' },
    { title: '洗衣机洗衣机洗衣机洗衣机洗衣机洗衣机洗衣机', id: 'xiyiji' },
    { title: '冰箱', id: 'bingxiang' },
    { title: '空调', id: 'kongtiao' },
    { title: '汽车', id: 'qiche' },
  ])

  return (
    <>
      <h1>Tip</h1>
      <div className="select-Tip__wrap">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          render={(item) => {
            console.log(item)
            return (
              <EllipsisTooltip
                tooltipProps={{
                  placement: 'right',
                  gutterGap: 14,
                }}
              >
                {item.title}
              </EllipsisTooltip>
            )
          }}
          displayRender={(item) => {
            return (
              <EllipsisTooltip
                tooltipProps={{
                  gutterGap: 14,
                }}
              >
                {item.title}
              </EllipsisTooltip>
            )
          }}
        />
      </div>
    </>
  )
}
