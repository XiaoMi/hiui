import React, { Component } from 'react'
import classNames from 'classnames'
import Provider from '../context'
import './style/index'
import Icon from '../icon'

class Timeline extends Component {
  state = { expanded: false }
  renderGroup = (item, index, isLast) => {
    return (
      <div key={index}>
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
        key={index}
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

        {(item.icon && <div className='item__icon'>{item.icon}</div>) || (
          <div className='item__dot' />
        )}
        <div className='item__line' />
      </div>
    )
  }
  renderCollapse = (subItems) => {
    return (
      <div className='timeline__collapse' key={'collapse'}>
        {this.state.expanded === true &&
          subItems.map((c, idx) => {
            return this.renderSub(c, idx)
          })}
        <div
          className='collapse-opt'
          onClick={() => {
            this.setState({ expanded: !this.state.expanded })
          }}
        >
          {this.state.expanded === true ? '收起' : '展开'}
          <Icon name={this.state.expanded === true ? 'up' : 'down'} />
          <div className='item__line' />
        </div>
      </div>
    )
  }
  renderSub = (item, index, isLast, isFirst) => {
    return (
      <div
        key={index}
        className={classNames('timeline__item', {
          'timeline__item--last': isLast,
          'timeline__item--first': isFirst
        })}
      >
        <div className='item--left'>
          <div className='item__time'>{item.timestamp}</div>
          <div className='item__extra'>{item.extraTime}</div>
        </div>
        {item.icon || <div className='item__dot' />}
        <div className='item__line' />
        <div className='item--right'>
          <div className='item__title'>{item.title}</div>
          <div className='item__content'>{item.content}</div>
        </div>
      </div>
    )
  }
  renderCross = (item, index, isLast, isFirst) => {
    return (
      <div
        key={index}
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
        {(item.icon && <div className='item__icon'>{item.icon}</div>) || (
          <div className='item__dot' />
        )}
        <div className='item__line' />
        <div className='item--right'>
          <div className='item__title'>{item.title}</div>
          <div className='item__content'>{item.content}</div>
        </div>
      </div>
    )
  }

  renderDefault = (item, index, isLast, isFirst) => {
    return [
      <div
        key={index}
        className={classNames('timeline__item', {
          'timeline__item--last': isLast,
          'timeline__item--first': isFirst
        })}
      >
        <div className='item--left'>
          <div className='item__time'>{item.timestamp}</div>
          <div className='item__extra'>{item.extraTime}</div>
        </div>
        {(item.icon && <div className='item__icon'>{item.icon}</div>) || (
          <div className='item__dot' />
        )}
        <div className='item__line' />
        <div className='item--right'>
          <div className='item__title'>{item.title}</div>
          <div className='item__content'>{item.content}</div>
        </div>
      </div>,
      item.children && this.renderCollapse(item.children)
    ]
  }
  render () {
    const { layout, type, list, data, theme } = this.props
    const _layout = type === 'default' ? layout : type
    const rootCls = classNames(
      'hi-timeline',
      `theme__${theme}`,
      `hi-timeline--${['normal', 'default'].includes(_layout) ? 'default' : _layout}`
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
