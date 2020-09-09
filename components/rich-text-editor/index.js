import React, { forwardRef } from 'react'
import classNames from 'classnames'

import ReactQuill from 'react-quill'

import Tooltip from '../tooltip'
import './style/index'

const QuillBarTooltip = props => {
  const { toolbarsName, tooltipTitle, children, showTooltip = true } = props
  return (
    <span className='hi-quill-toolbar-tooltip'>
      {showTooltip ? (
        <Tooltip
          className='hi-quill-toolbar'
          title={tooltipTitle || toolbarsName}
        >
          {children || <button className={`ql-${toolbarsName}`} />}
        </Tooltip>
      ) : (
        <div className='hi-quill-toolbar hi-quill-custom'>
          {children || <button className={`ql-${toolbarsName}`} />}
        </div>
      )}
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
