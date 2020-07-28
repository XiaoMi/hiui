import React from 'react'
// import classNames from 'classnames'
import './style/index'
import './iconfont.js'

class Icon extends React.Component {
  render () {
    const { name } = this.props
    return (
      <svg class='icon' aria-hidden='true'>
        <use xlinkHref={`#icon${name}`} />
      </svg>
    )
  }
}

export default Icon
