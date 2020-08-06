import React, { useState } from 'react'
import Icon from '../../../../../components/icon'
import { outlined, filled } from './config'
import Radio from '../../../../../components/radio'

const Tip = () => {
  const [currentType, setCurrentType] = useState(0)
  const list = currentType === 0 ? outlined : filled
  return (
    <div className='hi-icon-list'>
      <h3>提示</h3>
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
          <li key={idx}>
            <Icon name={icon.name} filled={currentType === 1} />
            <span className='hi-icon-name'>{icon.name}</span>
            <span className='hi-icon-cname'>{icon.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Tip
