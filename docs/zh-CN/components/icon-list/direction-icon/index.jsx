import React from 'react'
import { outlined } from './config'
import CopyIcon from '../copyIcon'
const Direction = () => {
  return (
    <div className='hi-icon-list'>
      <h3>方向</h3>
      <ul className='hi-icon-list'>
        {outlined.map((icon, idx) => (
          <CopyIcon icon={icon} key={idx} />
        ))}
      </ul>
    </div>
  )
}
export default Direction
