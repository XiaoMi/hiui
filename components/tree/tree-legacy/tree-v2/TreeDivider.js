import React from 'react'
import ClassNames from 'classnames'
const TreeDivider = (props) => {
  return (
    <div
      className={ClassNames(
        'hi-tree-legacy__divider',
        `theme__${props.theme}`,
        `hi-tree-legacy__divider--${props.placement}`
      )}
    >
      <div className="divider-circle" />
      <div className="divider-line" />
    </div>
  )
}

export default TreeDivider
