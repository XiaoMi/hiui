import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from '../icon'
import './style/index'

class Breadcrumb extends Component {
  render () {
    const { separator, data, onClick } = this.props
    return <div className='hi-breadcrumb'>
      {
        data.map((item, index) => {
          return <span key={index} className='hi-breadcrumb__item'>
            <span className='hi-breadcrumb__content' onClick={() => { onClick(item.path) }}>{item.icon && <Icon name={item.icon} />}{item.content}</span>
            <span className='hi-breadcrumb__separator'>{separator}</span>
          </span>
        })
      }
    </div>
  }
}

Breadcrumb.propTypes = {
  separator: PropTypes.string,
  data: PropTypes.array,
  onClick: PropTypes.func
}
Breadcrumb.defaultProps = {
  separator: '|',
  data: [],
  onClick: () => {}
}
export default Breadcrumb
