import React from 'react'
import ClassNames from 'classnames'
const TreeDivider = props => {
  return (
    <div
      className={ClassNames(
        'hi-tree__divider',
        `hi-tree__divider--${props.top ? 'top' : 'bottom'}`
      )}
    >
      <div className='divider-circle' />
      <div className='divider-line' />
    </div>
  )
}

export default TreeDivider
