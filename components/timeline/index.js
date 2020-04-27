import React, { Component } from 'react'
import classNames from 'classnames'
import Provider from '../context'
import './style/index'
import FoldingItem from './FoldingItem'
import Icon from '../icon'

const Time = (props) => {
  return (
    <div className='hi-timeline__time'>
      {props.groupTitle && (
        <div style={{ marginTop: -22 }} className='hi-timeline__group-title'>
          {props.groupTitle}
        </div>
      )}
      {props.item.timestamp}
      {<div className='hi-timeline__extra-time'>{props.item.extraTime}</div>}
    </div>
  )
}
class Timeline extends Component {
  /**
   * 渲染列表项
   * @param {*} item 原始数据
   * @param {*} index 用于是否渲染 groupTitle 的条件
   * @param {*} groupTitle 分组标题
   * @param {*} isSub 是否是子项，只支持一级
   */
  // renderItem (item, index, groupTitle, isSub) {
  //   const { layout, type } = this.props
  //   // TODO: dot 废弃，使用 icon
  //   const dot = item.dot
  //   const icon = item.icon
  //   let dotEl = isSub ? (
  //     <div className='hi-timeline__dot hi-timeline__dot--sub' />
  //   ) : (
  //     <div className='hi-timeline__dot' />
  //   )
  //   if (dot && typeof dot === 'object') {
  //     dotEl = <div className='hi-timeline__dot hi-timeline__dot--custom'>{dot}</div>
  //   }
  //   if (icon && typeof icon === 'string') {
  //     dotEl = (
  //       <div className='hi-timeline__dot hi-timeline__dot--custom'>
  //         <Icon name={icon} />
  //       </div>
  //     )
  //   } else if (icon && React.isValidElement(icon)) {
  //     dotEl = <div className='hi-timeline__dot hi-timeline__dot--custom'>{icon}</div>
  //   }
  //   const itemCls = classNames('hi-timeline__item', isSub && 'hi-timeline__item--sub')
  //   return (
  //     <li className={itemCls} key={item.title + index}>
  //       {layout === 'normal' && type === 'default' && (
  //         <Time item={item} groupTitle={index === 0 && groupTitle} />
  //       )}
  //       <div className='hi-timeline__row'>
  //         {((layout === 'cross' && type === 'default') || type === 'cross') && <Time item={item} />}
  //         <div className='hi-timeline__content-container'>
  //           <div className='hi-timeline__title'>{item.title}</div>
  //           {/* TODO: description 废弃，使用 content */}
  //           <div className='hi-timeline__desc'>{item.content || item.description}</div>
  //           {((layout === 'right' && type === 'default') || type === 'right') && (
  //             <div className='hi-timeline__time--extra'>{item.timestamp}</div>
  //           )}
  //         </div>
  //       </div>
  //       <div className='hi-timeline__line' />
  //       {dotEl}
  //     </li>
  //   )
  // }
  /**
   * 渲染列表，被递归调用
   * @param {Array} datas 数据
   * @param {String | React.ReactNode} groupTitle  分组标题
   * @param {Number} originIndex  原始索引，用于判断是否为第一个分组标题
   */
  // renderItems (data, groupTitle, isSub) {
  //   const { layout, localeDatas, type } = this.props
  //   return data.map((item, index) => {
  //     const { groupTitle: gt } = item
  //     if (gt) {
  //       // 渲染分组
  //       return this.renderItems(item.children, gt)
  //     }
  //     if (item.children && layout !== 'cross' && type !== 'cross') {
  //       // 子项 含 收起按钮
  //       const foldingEl = (
  //         <FoldingItem
  //           key={index}
  //           texts={localeDatas.timeline}
  //           subChildren={this.renderItems(item.children, null, true)}
  //         />
  //       )
  //       // 如果含有子项，需先渲染当前项
  //       let el = this.renderItem(item, index, groupTitle)
  //       return [el, foldingEl]
  //     }
  //     return this.renderItem(item, index, groupTitle, isSub)
  //   })
  // }
  renderGroup = (item, index, isLast) => {
    return (
      <div>
        <div
          className={classNames('timeline__group-title', {
            'timeline__group-title--first': index === 0
          })}
        >
          {item.groupTitle}
          {index !== 0 && <div className='item__line' />}
        </div>
        <div>
          {item.children.map((i, idx) => {
            const isFirst = index === 0 && idx === 0
            const _isLast = isLast && idx === item.children.length - 1
            return this.renderItem(i, idx, _isLast, isFirst)
          })}
        </div>
      </div>
    )
  }

  renderItem = (item, index, isLast, isFirst) => {
    if (this.props.type === 'default') {
      return this.renderDefault(item, index, isLast, isFirst)
    }
    if (this.props.type === 'right') {
      return this.renderRight(item, index, isLast, isFirst)
    }
    if (this.props.type === 'cross') {
      return this.renderCross(item, index, isLast, isFirst)
    }
  }

  renderRight = (item, index, isLast, isFirst) => {
    return (
      <div
        className={classNames('timeline__item', {
          'timeline__item--last': isLast,
          'timeline__item--first': isFirst
        })}
      >
        <div className='item__title'>{item.title}</div>
        <div className='item__content'>{item.content}</div>
        <div className='item__time'>
          {item.timestamp} {item.extraTime}
        </div>

        <div className='item__dot' />
        <div className='item__line' />
      </div>
    )
  }

  renderCross = (item, index, isLast, isFirst) => {
    return (
      <div
        className={classNames('timeline__item', {
          'timeline__item--last': isLast,
          'timeline__item--first': isFirst,
          'timeline__item--left': index % 2 === 1,
          'timeline__item--right': index % 2 === 0
        })}
      >
        <div className='item--left'>
          <div className='item__time'>{item.timestamp}</div>
          <div className='item__extra'>{item.extraTime}</div>
        </div>
        <div className='item__dot' />
        <div className='item__line' />
        <div className='item--right'>
          <div className='item__title'>{item.title}</div>
          <div className='item__content'>{item.content}</div>
        </div>
      </div>
    )
  }

  renderDefault = (item, index, isLast, isFirst) => {
    return (
      <div
        className={classNames('timeline__item', {
          'timeline__item--last': isLast,
          'timeline__item--first': isFirst
        })}
      >
        <div className='item--left'>
          <div className='item__time'>{item.timestamp}</div>
          <div className='item__extra'>{item.extraTime}</div>
        </div>
        <div className='item__dot' />
        <div className='item__line' />
        <div className='item--right'>
          <div className='item__title'>{item.title}</div>
          <div className='item__content'>{item.content}</div>
        </div>
      </div>
    )
  }
  render () {
    const { layout, type, list, data, theme } = this.props
    const _layout = type === 'default' ? layout : type
    const rootCls = classNames(
      'hi-timeline',
      `theme__${theme}`,
      `hi-timeline--${
        ['normal', 'default'].includes(_layout) ? 'default' : _layout
      }`
    )
    return (
      <div className={rootCls}>
        <ul>
          {(data || list).map((item, index) => {
            if (item.groupTitle) {
              const isLast = index === (data || list).length - 1
              return this.renderGroup(item, index, isLast)
            } else {
              const isLast = index === (data || list).length - 1
              const isFirst = index === 0
              return this.renderItem(item, index, isLast, isFirst)
            }
          })}
        </ul>
      </div>
    )
  }
}
Timeline.defaultProps = {
  layout: 'normal', // TODO:废弃，使用 type
  type: 'default'
}
export default Provider(Timeline)
