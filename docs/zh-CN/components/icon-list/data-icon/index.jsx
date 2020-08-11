import React, { useEffect } from 'react'
import CopyIcon from '../copyIcon'
import { outlined } from './config'

const Data = () => {
  useEffect(() => {}, [])
  return (
    <div className='hi-icon-list'>
      <h3>数据</h3>
      <ul className='hi-icon-list'>
        {outlined.map((icon, idx) => (
          <CopyIcon icon={icon} key={idx} />
        ))}
      </ul>
    </div>
  )
}
export default Data
