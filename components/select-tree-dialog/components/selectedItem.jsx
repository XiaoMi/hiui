import React from 'react'
import Icon from '../../icon'

export const SelectedItem = (props) => {
  const { id, desc, prefixCls, onRemoveClick = () => {} } = props

  return (
    <div key={id} className={`${prefixCls}__selected-item`}>
      <span className={`${prefixCls}__selected-item__desc`}>{desc}</span>
      <Icon name="close" className={`${prefixCls}__selected-item__button`} onClick={() => onRemoveClick(id)} />
    </div>
  )
}
