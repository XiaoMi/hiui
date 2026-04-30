import React from 'react'
import Select from '../src'

/**
 * @title 吸底内容条
 */
export const Footer = () => {
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
      <h1>Footer</h1>
      <div className="select-footer__wrap">
        <Select
          style={{ width: 240 }}
          clearable={false}
          data={data}
          renderExtraFooter={() => {
            return (
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                Custom Footer
              </div>
            )
          }}
        />
      </div>
    </>
  )
}
