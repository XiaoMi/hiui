import React from 'react'
import { GroupMenu } from '../src'

/**
 * @title 分组菜单
 */
export const Group = () => {
  const [activeId, setActiveId] = React.useState<React.ReactText>()

  return (
    <>
      <h1>Group</h1>
      <div
        className="menu-group__wrap"
        style={{ background: '#f5f7fa', padding: 20, minWidth: 600 }}
      >
        <GroupMenu
          style={{ width: 240, background: '#fff' }}
          activeId={activeId}
          onClick={(evt, id, item) => {
            console.log(evt, id, item)
            setActiveId(id)
          }}
          data={[
            {
              title: '小米',
              id: 666,
              children: [
                {
                  title: '小米5',
                  id: 'xiaomi5',
                },
                {
                  title: '小米4',
                  id: 'xiaomi4',
                },
                {
                  title: '小米3',
                  id: 'xiaomi3',
                },
                {
                  title: '小米2',
                  id: 'xiaomi2',
                },
                {
                  title: '小米1',
                  id: 'xiaomi1',
                },
              ],
            },
            {
              title: '小米note',
              id: 'xiaominote',
              children: [
                {
                  title: '小米 note5',
                  id: 'xiaomi note5',
                },
                {
                  title: '小米 note4',
                  id: 'xiaomi note4',
                },
                {
                  title: '小米 note3',
                  id: 'xiaomi note3',
                },
                {
                  title: '小米 note2',
                  id: 'xiaomi note2',
                },
                {
                  title: '小米 note1',
                  id: 'xiaomi note1',
                },
              ],
            },
          ]}
        />
      </div>
    </>
  )
}
