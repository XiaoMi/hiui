import React, { useCallback, useRef } from 'react'
import Button from '../button'
import request from './request'

const FileSelect = ({ children, onSelect }) => {
  const inputRef = useRef(null)
  const onClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }, [inputRef.current])
  return (
    <div onClick={onClick}>
      <input
        type='file'
        style={{ display: 'none' }}
        onChange={(e) => {
          onSelect(e.target.files)
        }}
        ref={inputRef}
      />
      {children}
    </div>
  )
}

export default FileSelect
