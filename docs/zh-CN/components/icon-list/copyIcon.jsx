import React, { useEffect, useState } from 'react'
import Clipboard from 'clipboard'
import Icon from '../../../../components/icon'

const CopyIcon = ({ icon }) => {
  const [copyed, setCopyed] = useState(false)
  useEffect(() => {
    const clipboard = new Clipboard(`#icon-copy-btn-${icon.name}`)
    clipboard.on('success', function (e) {
      setCopyed(true)
      e.clearSelection()
      setTimeout(() => {
        setCopyed(false)
      }, 500)
    })
  }, [])
  return (
    <li
      style={{ cursor: 'pointer', position: 'relative' }}
      id={'icon-copy-btn-' + icon.name}
      data-clipboard-target={`#icon-copy-${icon.name}`}
    >
      <Icon name={icon.name} />
      <span className='hi-icon-name'>{icon.name}</span>
      <span className='hi-icon-cname'>{icon.text}</span>
      <input id={'icon-copy-' + icon.name} style={{ opacity: 0, cursor: 'pointer' }} value={icon.name} readOnly />
      {copyed && (
        <span style={{ position: 'absolute', right: 4, top: 4, color: '#fff', fontSize: '14px' }}>已复制</span>
      )}
    </li>
  )
}
export default CopyIcon
