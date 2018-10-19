import React from 'react'
import PropTypes from 'prop-types'
import Provider from '../context'

const Pager = props => {
  const prefixCls = `${props.rootPrefixCls}-item`
  let cls = `${prefixCls} ${prefixCls}-${props.page}`

  if (props.active) {
    cls = `${cls} ${prefixCls}-active`
  }

  if (props.className) {
    cls = `${cls} ${props.className}`
  }

  const handClick = () => {
    props.onClick(props.page)
  }
  const pageHref = props.pageLink ? `#page=${props.page}` : 'javascript:;'

  return (
    <li className={cls} onClick={handClick}>
      {props.itemRender(
        props.page,
        'page',
        <a href={pageHref}>{props.page}</a>
      )}
    </li>
  )
}
Pager.propTypes = {
  page: PropTypes.number,
  active: PropTypes.bool,
  className: PropTypes.string,
  rootPrefixCls: PropTypes.string,
  onClick: PropTypes.func
}

export default Provider(Pager)
