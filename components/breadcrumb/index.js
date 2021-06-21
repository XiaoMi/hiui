import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Icon from '../icon'
import Provider from '../context'

import './style/index'

const Breadcrumb = (props) => {
  const { separator, data, onClick, theme } = props

  return (
    <ul className={`hi-breadcrumb theme__${theme}`}>
      {data.map((item, index) => {
        return (
          <li key={index} className="hi-breadcrumb__item">
            {item.href && index !== data.length - 1 ? (
              <a
                href={item.href}
                target={item.target}
                onClick={() => {
                  onClick(item, index)
                }}
                className={classNames('hi-breadcrumb__content', {
                  'hi-breadcrumb__content__active': index === data.length - 1
                })}
              >
                {item.icon && <Icon name={item.icon} />}
                {item.content}
              </a>
            ) : (
              <span
                className={classNames('hi-breadcrumb__content', {
                  'hi-breadcrumb__content__active': index === data.length - 1
                })}
                onClick={() => {
                  onClick(item, index)
                }}
              >
                {item.icon && <Icon name={item.icon} />}
                {item.content}
              </span>
            )}

            <span className="hi-breadcrumb__separator">{separator}</span>
          </li>
        )
      })}
    </ul>
  )
}

Breadcrumb.propTypes = {
  separator: PropTypes.string,
  data: PropTypes.array,
  onClick: PropTypes.func
}
Breadcrumb.defaultProps = {
  separator: '/',
  data: [],
  onClick: () => {}
}
export default Provider(Breadcrumb)
