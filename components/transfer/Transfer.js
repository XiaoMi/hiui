import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../button'
import Checkbox from '../checkbox'
import Icon from '../icon'
import Input from '../input'
import classNames from 'classnames'
import Item from './Item'
import shallowEqual from 'shallowequal'
import Provider from '../context'

import './style/index'
class Transfer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sourceList: [],
      targetList: [],
      sourceSelectedKeys: [],
      targetSelectedKeys: [],
      leftFilter: '',
      rightFilter: '',
      leftChecked: false,
      rightChecked: false,
      limited: false,
      targetNode: null,
      sourceNode: null,
      positionX: null,
      positionY: null,
      dividerPosition: null
    }
  }
  componentDidMount () {
    this.parseDatas(this.props)
  }
  setPosition = (x, y) => {
    const { positionX, positionY } = this.state
    if (!(x === positionX && y === positionY)) {
      this.setState({
        positionX: x,
        positionY: y
      })
    }
  }

  parseDatas (props) {
    const { data, targetKeys, targetIds } = props
    const sourceList = []
    const targetList = []
    const _dataObj = {}

    data.forEach(item => {
      _dataObj[item.id] = item
      if (!(targetIds || targetKeys).includes(item.id)) {
        sourceList.push(item)
      }
    })
    ;(targetIds || targetKeys).forEach(item => {
      _dataObj[item] && targetList.push(_dataObj[item])
    })

    this.setState({
      sourceList,
      targetList
    })
  }
  componentWillReceiveProps (props) {
    this.parseDatas(props)
  }

  getSelectedKeysByDir (dir) {
    return dir === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys'
  }
  clickItemEvent (item, index, dir) {
    const { mode, type } = this.props
    const { limited } = this.state
    if (item.disabled) {
      return
    }
    if (mode === 'basic' && type === 'default') {
      !(dir === 'left' && limited) && this.parseSelectedKeys(dir, item.id, () => {
        this.moveTo(dir)
      })
    }
  }
  parseSelectedKeys (dir, key, callback) {
    const {
      sourceSelectedKeys,
      targetSelectedKeys,
      sourceList,
      targetList,
      leftFilter,
      rightFilter
    } = this.state
    const selectedItem = dir === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys]
    const checkedKey = dir + 'Checked'
    const originDatas = dir === 'left' ? sourceList : targetList
    const filterText = dir === 'left' ? leftFilter : rightFilter
    const selectedIndex = selectedItem.indexOf(key)
    if (selectedIndex > -1) {
      selectedItem.splice(selectedIndex, 1)
    } else {
      selectedItem.push(key)
    }
    const filterResult = []
    originDatas.forEach(item => {
      item.content.includes(filterText) && filterResult.push(item.id)
    })
    const checkoutStatue = filterText.length
      ? filterResult.every(item => {
        return selectedItem.includes(item)
      })
      : shallowEqual(selectedItem.sort(), filterResult.sort())
    this.setState(
      {
        [this.getSelectedKeysByDir(dir)]: selectedItem,
        [checkedKey]: checkoutStatue
      },
      () => {
        callback && callback()
        this.isLimited(dir)
      }
    )
  }
  checkboxEvent (dir, value, isChecked) {
    this.parseSelectedKeys(dir, value, null)
  }
  moveTo (dir) {
    const { targetKeys, targetIds, data, targetSortType } = this.props
    const { sourceSelectedKeys, targetSelectedKeys } = this.state
    const selectedItem = dir === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys]
    const _concatTargetKeys =
      targetSortType === 'queue'
        ? (targetIds || targetKeys).concat(selectedItem)
        : selectedItem.concat(targetIds || targetKeys)
    const newTargetKeys =
      dir === 'left'
        ? _concatTargetKeys
        : (targetIds || targetKeys).filter(tk => !selectedItem.includes(tk))
    this.setState(
      {
        [this.getSelectedKeysByDir(dir)]: newTargetKeys,
        leftChecked: false,
        rightChecked: false
      },
      () => {
        const moveDatas = []
        selectedItem.forEach(key => {
          data.forEach(item => {
            item.id === key && moveDatas.push(item)
          })
        })

        this.props.onChange(newTargetKeys, dir === 'left' ? 'right' : 'left', moveDatas)
        this.setState({
          [this.getSelectedKeysByDir(dir)]: [],
          [dir + 'Filter']: ''
        }, () => {
          this.isLimited(dir)
        })
      }
    )
  }
  allCheckboxEvent = dir => {
    const { sourceList, targetList, leftFilter, rightFilter } = this.state
    const originDatas = dir === 'left' ? sourceList : targetList
    const filterText = dir === 'left' ? leftFilter : rightFilter
    const checkedKey = dir + 'Checked'
    const arr = []

    if (!this.state[checkedKey]) {
      originDatas.forEach(data => {
        data.content.includes(filterText) && !data.disabled && arr.push(data.id)
      })
    }
    this.setState(
      {
        [this.getSelectedKeysByDir(dir)]: arr,
        [checkedKey]: !this.state[checkedKey]
      },
      () => {
        this.isLimited(dir)
      }
    )
  }
  isLimited (dir) {
    const { targetList, sourceSelectedKeys } = this.state
    const { targetLimit, type } = this.props
    const defaultLimited = sourceSelectedKeys.length > targetLimit || sourceSelectedKeys.length + targetList.length > targetLimit
    const _limited = type === 'default' ? defaultLimited || targetList.length >= targetLimit : defaultLimited

    this.setState({
      limited: _limited
    })
  }
  searchEvent (dir, e) {
    const { sourceList, targetList, sourceSelectedKeys, targetSelectedKeys } = this.state
    const originDatas = dir === 'left' ? sourceList : targetList
    const filterResult = []
    const filterText = e.target.value
    originDatas.forEach(item => {
      item.content.includes(filterText) && filterResult.push(item.id)
    })
    const selectedKeys = dir === 'left' ? sourceSelectedKeys : targetSelectedKeys
    const checkedKey = dir + 'Checked'

    const checkoutStatue = e.target.value.length
      ? filterResult.every(item => {
        return selectedKeys.includes(item)
      })
      : shallowEqual(selectedKeys.sort(), filterResult.sort())

    this.setState({
      [dir + 'Filter']: e.target.value,
      [checkedKey]: checkoutStatue
    })
  }

  move (sourceItem, targetItem) {
    const { targetList, dividerPosition } = this.state
    const _targetList = [...targetList]
    let sIdx
    let tIdx
    targetList.forEach((item, index) => {
      if (item.id === targetItem.id) {
        const position = dividerPosition === 'down' ? index + 1 : index
        _targetList.splice(position, 0, sourceItem)
        tIdx = index
      }
      if (item.id === sourceItem.id) {
        sIdx = index
      }
    })
    if (sIdx < tIdx) {
      _targetList.splice(sIdx, 1)
    } else {
      _targetList.splice(sIdx + 1, 1)
    }
    this.props.onDragEnd(_targetList)
    this.setState({ targetList: _targetList })
  }
  setTargetNode (id, dividerPosition) {
    this.setState({ targetNode: id, dividerPosition })
  }
  removeTargetNode () {
    this.setState({ targetNode: null })
  }
  setSourceNode (id) {
    this.setState({ sourceNode: id })
  }
  removeSourceNode () {
    this.setState({ sourceNode: null })
  }
  renderContainer (dir, datas) {
    const {
      mode,
      type,
      showCheckAll,
      showAllSelect,
      searchable,
      draggable,
      emptyContent,
      title,
      disabled,
      theme,
      localeDatas,
      onDragStart,
      onDrop
    } = this.props
    const {
      sourceSelectedKeys,
      targetSelectedKeys,
      leftFilter,
      rightFilter,
      leftChecked,
      rightChecked,
      limited,
      targetNode,
      sourceNode,
      positionX,
      positionY,
      dividerPosition
    } = this.state
    const localeMap = localeDatas.transfer || {}
    const selectedKeys = dir === 'left' ? sourceSelectedKeys : targetSelectedKeys
    const filterText = dir === 'left' ? leftFilter : rightFilter
    const filterResult = datas.filter(item => item.content.includes(filterText))
    const _isChecked = dir === 'left' ? leftChecked : rightChecked

    const _title = dir === 'left' ? title[0] : title[1] || title[0]
    return (
      <div className='hi-transfer__container'>
        {disabled && <div className='hi-transfer__mask' />}
        {_title &&
          <div className='hi-transfer__title'>
            {_title}
          </div>}
        {searchable &&
          <div className='hi-transfer__searchbar'>
            <Icon name='search' />
            <Input
              placeholder='搜索'
              clearable='true'
              clearableTrigger='always'
              onInput={this.searchEvent.bind(this, dir)}
              onChange={this.searchEvent.bind(this, dir)}
              value={filterText}
            />
          </div>}
        <div
          className={`hi-transfer__body ${filterResult.length === 0
            ? 'hi-transfer__body--empty'
            : ''}`}
        >
          {filterResult.length > 0
            ? <ul className='hi-transfer__list'>
              {dir === 'left' &&
                  limited &&
                  <li key='limit-tips' className='hi-transfer__item hi-transfer__item--limit'>
                    <Icon name='info-circle-o' style={{fontSize: 16, color: '#D4A145', marginRight: 9}} />
                    <span>{localeMap['limit']}</span>
                  </li>}
              {filterResult.map((item, index) => {
                return (
                  <Item
                    dir={dir}
                    dividerPosition={dividerPosition}
                    draggable={draggable}
                    key={index}
                    theme={theme}
                    onClick={this.clickItemEvent.bind(this, item, index, dir)}
                    mode={mode === 'basic' && type === 'default' ? 'basic' : 'multiple'}
                    item={item}
                    checked={selectedKeys.includes(item.id)}
                    checkboxOnChange={this.checkboxEvent.bind(this, dir)}
                    move={this.move.bind(this)}
                    setTargetNode={this.setTargetNode.bind(this)}
                    removeTargetNode={this.removeTargetNode.bind(this)}
                    targetNode={targetNode}
                    setSourceNode={this.setSourceNode.bind(this)}
                    removeSourceNode={this.removeSourceNode.bind(this)}
                    sourceNode={sourceNode}
                    setPosition={this.setPosition}
                    positionX={positionX}
                    positionY={positionY}
                    onDragStart={onDragStart}
                    onDrop={onDrop}
                  />
                )
              })}
            </ul>
            : dir === 'left' ? emptyContent[0] : emptyContent[1] || emptyContent[0]}
        </div>
        {(mode !== 'basic' || type !== 'default') &&
          (showAllSelect || showCheckAll) &&
          <div className='hi-transfer__footer' onClick={() => {}}>
            <Checkbox
              indeterminate={!!selectedKeys.length && !_isChecked}
              checked={_isChecked && !!filterResult.length}
              onChange={() => {
                this.allCheckboxEvent(dir)
              }}
            >
              {localeMap['checkAll']}
            </Checkbox>
            <span>
              {selectedKeys.length + '/'}
              {filterResult.length} {localeMap['items']}
            </span>
          </div>}
      </div>
    )
  }

  render () {
    const { mode, type, theme } = this.props
    const { sourceList, targetList, sourceSelectedKeys, targetSelectedKeys, limited } = this.state
    const operCls = classNames(
      'hi-transfer__operation',
      mode === 'basic' && type === 'default' && 'hi-transfer__operation--basic'
    )
    const isLeftDisabled = targetSelectedKeys.length === 0
    const isRightDisabled = sourceSelectedKeys.length === 0 || limited
    return (
      <div className={`hi-transfer theme__${theme}`}>
        {this.renderContainer('left', sourceList)}
        <div className={operCls}>
          {(mode !== 'basic' || type !== 'default') &&
            <React.Fragment>
              <Button
                type={isRightDisabled ? 'default' : 'primary'}
                icon='right'
                onClick={() => {
                  if (!isRightDisabled) {
                    this.moveTo('left')
                  }
                }}
                disabled={isRightDisabled}
              />
              <span className='hi-transfer__split' />
              <Button
                type={isLeftDisabled ? 'default' : 'primary'}
                icon='left'
                onClick={() => {
                  if (!isLeftDisabled) {
                    this.moveTo('right')
                  }
                }}
                disabled={isLeftDisabled}
              />
            </React.Fragment>}
        </div>
        {this.renderContainer('right', targetList)}
      </div>
    )
  }
}
export default Provider(Transfer)
Transfer.defaultProps = {
  mode: 'basic',
  type: 'default',
  targetKeys: [], // TODO:废弃，使用 targetIds
  showAllSelect: false,
  showCheckAll: false,
  searchable: false,
  draggable: false,
  emptyContent: ['暂无数据', '暂无数据'],
  title: ['', ''],
  disabled: false,
  onDragStart: () => true,
  onDragEnd: () => {},
  onDrop: () => true,
  onChange: () => {}
}
Transfer.propTypes = {
  mode: PropTypes.oneOf(['basic', 'multiple']), // TODO: 废弃，使用 type
  type: PropTypes.oneOf(['default', 'multiple']),
  showAllSelect: PropTypes.bool, // TODO: 废弃，使用 showCheckAll
  showCheckAll: PropTypes.bool,
  searchable: PropTypes.bool,
  draggable: PropTypes.bool,
  disabled: PropTypes.bool,
  targetLimit: PropTypes.number,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDrop: PropTypes.func,
  onChange: PropTypes.func
}
