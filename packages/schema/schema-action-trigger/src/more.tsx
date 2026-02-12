import React from 'react'
import { Dropdown } from '@hi-ui/dropdown'
import { EllipsisOutlined } from '@hi-ui/icons'
import { unifiedActionsCls as cls } from './_utils'
import type { ActionElType } from './actions'

type MoreActionTriggerProps = {
  els: ActionElType[]
}

export function MoreActionTrigger(props: MoreActionTriggerProps) {
  const data = props.els.map((el, id) => {
    if (el.type === 'config') {
      return {
        id,
        title: React.cloneElement(el.jsx, { appearance: 'link' }),
      }
    }

    return {
      id,
      title: <span>{el.jsx}</span>,
    }
  })

  if (data.length === 0) return null
  return (
    <Dropdown
      trigger="click"
      data={data}
      className={cls('more-trigger')}
      overlay={{ className: cls('more-overlay'), arrow: true }}
    >
      <EllipsisOutlined />
    </Dropdown>
  )
}
