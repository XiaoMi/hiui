import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'

function defaultItemRender (page, element) {
  return <span>{element}</span>
}

const Pager = props => {
  const prefixCls = `${props.rootPrefixCls}__item`
  let cls = classNames(prefixCls, {
    [`${prefixCls}-${props.page}`]: typeof props.page === 'number',
    [`${prefixCls}--active`]: props.active,
    [`${prefixCls}--disabled`]: props.disabled,
    [props.className]: !!props.className
  })
  const handClick = () => {
    !props.disabled && props.onClick(props.page)
  }

  return (
    <div className={cls} onClick={handClick}>
      {props.itemRender(props.page, props.children || props.page)}
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
