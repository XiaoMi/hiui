import React from 'react'
import Transfer from '../src'
import { Avatar } from '@hi-ui/avatar'

export const Render = () => {
  const [data] = React.useState([
    { avatarColor: '#237ffa', initials: 'R', id: '荣莎', title: '荣莎', dept: '信息技术部' },
    { avatarColor: '#9772fb', initials: 'N', id: '尼坚', title: '尼坚', dept: '手机部' },
    { avatarColor: '#0daeff', initials: 'L', id: '伦颖璧', title: '伦颖璧', dept: '信息技术部' },
    { avatarColor: '#38d677', initials: 'X', id: '幸婉娥', title: '幸婉娥', dept: '汽车部' },
    { avatarColor: '#fab007', initials: 'B', id: '柏胜', title: '柏胜', dept: '信息技术部' },
    { avatarColor: '#fe7940', initials: 'Q', id: '曲强', title: '曲强', dept: '信息技术部' },
    { avatarColor: '#237ffa', initials: 'P', id: '皮莎仪', title: '皮莎仪', dept: '信息技术部' },
    { avatarColor: '#9772fb', initials: 'Z', id: '仲希', title: '仲希', dept: '信息技术部' },
  ])
  const [targetIds, setTargetIds] = React.useState<React.ReactText[]>([2, 3])

  return (
    <>
      <h1>Render</h1>
      <div className="transfer-render__wrap">
        <Transfer
          type="multiple"
          data={data}
          targetLimit={6}
          targetIds={targetIds}
          onChange={(ids) => setTargetIds(ids)}
          emptyContent={['暂无数据']}
          render={(item: any) => {
            return (
              <div style={{ lineHeight: '20px', display: 'inline-flex', alignItems: 'center' }}>
                <Avatar
                  shape="square"
                  initials={item.initials}
                  size="sm"
                  style={{ backgroundColor: item.avatarColor }}
                />
                <div style={{ marginLeft: 8 }}>
                  <div style={{ marginTop: 4 }}>{item.title}</div>
                  <div style={{ color: '#929AA6', marginBottom: 4 }}>{item.dept}</div>
                </div>
              </div>
            )
          }}
        />
      </div>
    </>
  )
}
