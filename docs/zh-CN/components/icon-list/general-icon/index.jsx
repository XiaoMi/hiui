import React, { useState } from 'react'
import { outlined, filled } from './config'
import Radio from '../../../../../components/radio'
import CopyIcon from '../copyIcon'

const General = () => {
  const [currentType, setCurrentType] = useState(0)
  const list = currentType === 0 ? outlined : filled
  return (
    <div className='hi-icon-list'>
      <h3>通用</h3>
      <div style={{ textAlign: 'center' }}>
        <Radio.Group
          data={[
            {
              id: 0,
              content: '线型'
            },
            {
              id: 1,
              content: '面型'
            }
          ]}
          type='button'
          value={currentType}
          onChange={(v) => setCurrentType(v)}
        />
      </div>
      <ul className='hi-icon-list'>
        {list.map((icon, idx) => (
          <CopyIcon icon={icon} key={idx} />
        ))}
      </ul>
    </div>
  )
}
export default General
