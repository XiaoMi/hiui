import React from 'react'
import Icon from '../../../../../components/icon'
import { outlined, filled } from './config'
import Radio from '../../../../../components/radio'

const Edit = () => {
  return (
    <div className='hi-icon-list'>
      <h3>编辑</h3>
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
          defaultValue={0}
          onChange={(data) => console.log(data)}
        />
      </div>
      <ul className='hi-icon-list'>
        {outlined.map((icon, idx) => (
          <li key={idx}>
            <Icon name={icon.name} />
            <span className='hi-icon-name'>{icon.name}</span>
            <span className='hi-icon-cname'>{icon.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Edit
