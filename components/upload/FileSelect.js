import React, { useCallback, useRef } from 'react'

const FileSelect = ({ children, onSelect, multiple, disabled, accept, style, className }) => {
  const inputRef = useRef(null)
  const onClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }, [inputRef.current])
  return (
    <div onClick={onClick} className={className} style={style}>
      <input
        type="file"
        multiple={multiple && 'multiple'}
        disabled={disabled && 'disabled'}
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          onSelect(e.target.files)
          inputRef.current.value = ''
        }}
        ref={inputRef}
      />
      {children}
    </div>
  )
}

export default FileSelect
