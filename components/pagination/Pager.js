import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'

function defaultItemRender (page, element) {
  return (
    <a href='javascript:void 0'>{element}</a>
  )
}

const Pager = props => {
  const prefixCls = `${props.rootPrefixCls}__item`
  let cls = classNames(`${prefixCls} ${prefixCls}-${props.page}`, { [`${prefixCls}--active`]: props.active })

  if (props.active) {
    cls = `${cls} ${prefixCls}--active`
  }
  if (props.disabled) {
    cls = `${cls} ${prefixCls}--disabled`
  }
  if (props.className) {
    cls = `${cls} ${props.className}`
  }

  const handClick = () => {
    !props.disabled && props.onClick(props.page)
  }

  return (
    <div className={cls} onClick={handClick}>
      {props.itemRender(
        props.page,
        props.children || props.page
      )}
    </div>
  )
}
Pager.propTypes = {
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  rootPrefixCls: PropTypes.string,
  onClick: PropTypes.func
}
Pager.defaultProps = {
  itemRender: defaultItemRender
}

export default Provider(Pager)
