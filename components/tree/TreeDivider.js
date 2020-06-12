import React from 'react'
import ClassNames from 'classnames'
const TreeDivider = props => {
  return (
    <div
      className={ClassNames(
        'hi-tree__divider',
        `theme__${props.theme}`,
        `hi-tree__divider--${props.placement}`
      )}
    >
      <div className='divider-circle' />
      <div className='divider-line' />
    </div>
  )
}

export default TreeDivider
