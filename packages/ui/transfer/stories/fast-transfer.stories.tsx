import React from 'react'
import { Avatar } from '@hi-ui/avatar'
import { FastTransfer } from '../src'

/**
 * @title 快速穿梭框
 * @desc 选择源数据后，即刻展示到目标数据中
 */
export const FastTransferStories = () => {
  const [data] = React.useState(() => {
    const generateData = () => {
      const arr = []
      for (let i = 1; i < 100; i++) {
        arr.push({
          id: i,
          title: '选项' + i,
          disabled: i % 6 === 0,
        })
      }
      return arr
    }

    const data = generateData()
    return data
  })

  const [groupData] = React.useState(() => {
    return [
      {
        id: 'group1',
        groupTitle: '分组1',
        children: data.slice(0, 10),
      },
      {
        id: 'group2',
        groupTitle: '分组2',
        children: data.slice(10, 20),
      },
      {
        id: 'group3',
        groupTitle: '分组3',
        children: data.slice(20, 30),
      },
    ]
  })

  const [treeData] = React.useState(() => {
    return [
      {
        id: 'tree1',
        title: '树形1',
        children: data.slice(0, 10),
      },
      {
        id: 'tree2',
        title: '树形2',
        children: data.slice(10, 20),
      },
    ]
  })

  const [customData] = React.useState([
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
  const [targetIds2, setTargetIds2] = React.useState<React.ReactText[]>([2, 3])
  const [targetIds3, setTargetIds3] = React.useState<React.ReactText[]>([2, 3])
  const [targetIds4, setTargetIds4] = React.useState<React.ReactText[]>(['荣莎', '尼坚'])

  return (
    <>
      <h1>FastTransfer</h1>
      <div className="fast-transfer__wrap">
        <h2>基础用法</h2>
        <FastTransfer
          data={data}
          targetLimit={6}
          targetIds={targetIds}
          onChange={(ids) => setTargetIds(ids)}
          searchable={{
            left: true,
          }}
        />
        <h2>分组穿梭框</h2>
        <FastTransfer
          data={groupData}
          draggable={true}
          targetLimit={6}
          targetIds={targetIds2}
          onChange={(ids) => setTargetIds2(ids)}
          searchable={{
            left: true,
            right: true,
          }}
        />
        <h2>树形穿梭框</h2>
        <FastTransfer
          data={treeData}
          draggable={true}
          targetLimit={6}
          targetIds={targetIds3}
          onChange={(ids) => setTargetIds3(ids)}
          searchable={{
            left: true,
            right: true,
          }}
        />
        <h2>自定义渲染</h2>
        <FastTransfer
          data={customData}
          targetIds={targetIds4}
          onChange={(ids) => setTargetIds4(ids)}
          render={(item) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar
                  initials={item.raw?.initials}
                  size="sm"
                  style={{ backgroundColor: item.raw?.avatarColor }}
                />
                <div>
                  <div>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#91959e' }}>{item.raw?.dept}</div>
                </div>
              </div>
            )
          }}
        />
      </div>
    </>
  )
}
