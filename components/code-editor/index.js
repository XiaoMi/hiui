import React from 'react'
import classNames from 'classnames'

import { UnControlled, Controlled } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import './style/index.js'
const CodeEditor = ({ value, className, ...props }) => {
  return (
    <UnControlled
      value={value}
      className={classNames('hi-codeEditor', {
        className
      })}
      {...props}
    />
  )
}
export default CodeEditor
