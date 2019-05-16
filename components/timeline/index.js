import React, { Component } from 'react'
import Icon from '../icon'
import classNames from 'classnames'
import './style/index'

const Time = (props) => {
  return (
    <div className='hi-timeline__time'>
      <div style={props.groupTitle ? {marginTop: -20} : {}} className='hi-timeline__group-title'>{props.groupTitle}</div>
      {props.item.timestamp}
      {
        <div className='hi-timeline__extra-time'>{props.item.extraTime}</div>
      }
    </div>
  )
}
class Timeline extends Component {
  constructor (props) {
    super(props)
    this.datas = [{
      groupTitle: '1月',
      children: [{
        dot: <Icon name='circle' style={{fontSize: 16}} />, //     自定节点图标内容
        title: '管理层例会1', // 标题
        description: '毕加索会议室 B2层 可提前预定,毕加索会议室 B2层 可提前预定,毕加索会议室 B2层 可提前预定', // 二级描述
        timestamp: '9:00', //  时间节点
        extraTime: '02-25'
      }, {
        dot: 'circle', //     自定节点图标内容
        title: '管理层例会2', // 标题
        description: '毕加索会议室 B2层 可提前预定', // 二级描述
        timestamp: '10:00'//  时间节点
      }]
    }, {
      groupTitle: '2月',
      children: [{
        dot: 'circle', //     自定节点图标内容
        title: '管理层例会3', // 标题
        description: '毕加索会议室 B2层 可提前预定', // 二级描述
        timestamp: '12:00', //  时间节点
        folding: true, //  是否可折叠    如果为 false  , 将不显示折叠图标 及 忽略下面的 children   也可通过 groupTitle 来区分两种 children
        children: [{
          title: '子项',
          description: '毕加索会议室 B2层 可提前预定'
        }, {
          title: '子项',
          description: '毕加索会议室 B2层 可提前预定'
        }]
      }, {
        dot: <Icon name='circle' style={{fontSize: 16, color: 'red'}} />, //     自定节点图标内容
        title: '管理层例会4', // 标题
        description: '毕加索会议室 B2层 可提前预定', // 二级描述
        timestamp: '12:00'//  时间节点
      }]
    }, {
      groupTitle: '3月',
      children: [{
        dot: 'circle', //     自定节点图标内容
        title: '管理层例会5', // 标题
        description: '毕加索会议室 B2层 可提前预定', // 二级描述
        timestamp: '11:00', //  时间节点
        extraTime: '11-25'
      }, {
        dot: 'circle', //     自定节点图标内容
        title: '管理层例会6', // 标题
        description: '毕加索会议室 B2层 可提前预定', // 二级描述
        timestamp: '12:00'//  时间节点
      }]
    }]
  }
  /**
   * 渲染每一项
   * @param {*} item 数据
   * @param {*} groupTitle 分组标题
   * @param {*} originIndex 是否是第一组
   * @param {*} isEnd 是否是当前分组的结束
   * @param {*} index 当前索引
   */
  renderItem (item, groupTitle, originIndex, isEnd, index) {
    const { layout } = this.props
    let style = {}
    if (groupTitle) {
      if (originIndex === 0) {
        style = {marginTop: 20}
      }
      if (isEnd) {
        style = {paddingBottom: 20}
      }
    }
    const dot = item.dot
    let dotEl = <div className='hi-timeline__dot' />
    if (dot && typeof dot === 'object') {
      dotEl = <div className='hi-timeline__dot hi-timeline__dot--custom' >
        {dot}
      </div>
    }
    return <li className='hi-timeline__item' style={style} key={index}>
      {
        layout === 'normal' && <Time item={item} groupTitle={index === 0 && groupTitle} />
      }
      <div className='hi-timeline__row'>
        {
          layout === 'cross' && <Time item={item} />
        }
        <div className='hi-timeline__content-container'>
          <div className='hi-timeline__title'>{item.title}</div>
          <div className='hi-timeline__desc'>{item.description}</div>
          {
            layout === 'right' && (
              <div className='hi-timeline__time--extra'>{item.timestamp}</div>
            )
          }
        </div>
      </div>
      <div className='hi-timeline__line' />
      {dotEl}
    </li>
  }
  /**
   * 渲染列表，被递归调用
   * @param {Array} datas 数据
   * @param {String | React.ReactNode} groupTitle  分组标题
   * @param {Number} originIndex  原始索引，用于判断是否为第一个分组标题
   */
  renderItems (datas, groupTitle, originIndex) {
    return datas.map((item, index) => {
      const { groupTitle: _groupTitle, folding } = item
      if (folding && item.children.length > 0) {
        return this.renderItems(item.children)
      }
      if (_groupTitle) {
        return this.renderItems(item.children, _groupTitle, index)
      }
      return this.renderItem(item, groupTitle, originIndex, index === datas.length - 1, index)
    })
  }
  render () {
    const { layout } = this.props
    const rootCls = classNames(
      'hi-timeline',
      `hi-timeline--${layout}`
    )
    return <div className={rootCls}>
      <ul>
        {
          this.renderItems(this.datas)
        }
      </ul>
    </div>
  }
}
Timeline.defaultProps = {
  layout: 'normal'
}
export default Timeline
