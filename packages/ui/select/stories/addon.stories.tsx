import React from 'react'
import Select from '../src'
import { AppStoreOutlined, InfoCircleOutlined } from '@hi-ui/icons'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'

/**
 * @title 前后内置元素
 * @desc 将选择框与内置的其他元素组合使用
 */
export const Addon = () => {
  const [data] = React.useState([
    { title: '手机', id: 'shouji' },
    { title: '电脑', id: 'diannao' },
    { title: '电视', id: 'dianshi' },
    { title: '洗衣机', id: 'xiyiji' },
    { title: '冰箱', id: 'bingxiang' },
    { title: '空调', id: 'kongtiao' },
    { title: '汽车', id: 'qiche' },
  ])

  return (
    <>
      <h1>Addon</h1>
      <div className="select-addon__wrap">
        <Select
          style={{ width: 240 }}
          // clearable={false}
          data={data}
          prefix={<AppStoreOutlined style={{ color: '#333' }} />}
          suffix={<InfoCircleOutlined style={{ color: '#333' }} />}
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
