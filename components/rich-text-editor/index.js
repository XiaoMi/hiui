import React, { forwardRef } from 'react'
import classNames from 'classnames'

import ReactQuill from 'react-quill'

import Tooltip from '../tooltip'
import './style/index'

const QuillBarTooltip = props => {
  const { toolbarsName, title, children } = props
  return (
    <span className='hi-quill-content'>
      <Tooltip className='hi-quill-toolbar' title={title || toolbarsName}>
        {children || <button className={`ql-${toolbarsName}`} />}
      </Tooltip>
    </span>
  )
}
const InternalQuill = props => {
  const { className, innerRef, theme } = props

  return (
    <ReactQuill
      {...props}
      ref={el => {
        innerRef && (innerRef.current = el)
      }}
      className={classNames({
        'hi-quill-content': !theme,
        className
      })}
    />
  )
}

const RichTextEditor = forwardRef((props, ref) => {
  return <InternalQuill {...props} innerRef={ref} />
})
export default RichTextEditor
export { QuillBarTooltip }
