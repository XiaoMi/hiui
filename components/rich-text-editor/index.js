import React from 'react'

import './style/index'
const QuillBarTheme = props => {
  const { toolbarsName } = props
  return (
    <div className='hi-richEditor'>
      <button className={`ql-${toolbarsName}`} />
    </div>
  )
}
export default QuillBarTheme
