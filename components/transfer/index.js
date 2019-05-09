import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../button'
import Checkbox from '../checkbox'
import Icon from '../icon'
import Input from '../input'
import classNames from 'classnames'
import './style/index'

class Transfer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sourceList: [],
      targetList: [],
      sourceSelectedKeys: [],
      targetSelectedKeys: [],
      emptyContent: ['暂无数据', '暂无数据'],
      leftFilter: '',
      rightFilter: '',
      limited: false
    }
  }
  componentDidMount () {
    this.parseDatas(this.props)
  }
  parseDatas (props) {
    const { data, targetKeys } = props
    const sourceList = []
    const targetList = new Array(targetKeys.length)
    data.forEach((item, index) => {
      const targetIndexKey = targetKeys.indexOf(item.id)
      if (targetIndexKey > -1) {
        targetList[targetIndexKey] = item
      } else {
        sourceList.push(item)
      }
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
    const { mode } = this.props
    if (mode === 'basic') {
      this.parseSelectedKeys(dir, item.id, () => {
        this.moveTo(dir)
      })
    }
  }
  parseSelectedKeys (dir, key, callback) {
    const { sourceSelectedKeys, targetSelectedKeys } = this.state
    const selectedItem = dir === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys]
    const selectedIndex = selectedItem.indexOf(key)
    if (selectedIndex > -1) {
      selectedItem.splice(selectedIndex, 1)
    } else {
      selectedItem.push(key)
    }
    console.log(selectedItem)
    this.setState({
      [this.getSelectedKeysByDir(dir)]: selectedItem
    }, () => {
      callback && callback()
      this.isLimited(dir)
    })
  }
  checkboxEvent (dir, value, isChecked) {
    this.parseSelectedKeys(dir, value, null)
  }
  moveTo (dir) {
    const { targetKeys } = this.props
    const { sourceSelectedKeys, targetSelectedKeys } = this.state
    const selectedItem = dir === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys]
    const newTargetKeys = dir === 'left' ? selectedItem.concat(targetKeys) : targetKeys.filter(tk => selectedItem.indexOf(tk) === -1)
    this.setState({
      [this.getSelectedKeysByDir(dir)]: newTargetKeys
    }, () => {
      this.props.onChange(newTargetKeys)
      this.setState({
        [this.getSelectedKeysByDir(dir)]: [],
        [dir + 'Filter']: '',
        limited: false
      })
    })
  }
  allCheckboxEvent (dir, value, isChecked) {
    const { sourceList, targetList, leftFilter, rightFilter } = this.state
    const arr = []
    const originDatas = dir === 'left' ? sourceList : targetList
    const filterText = dir === 'left' ? leftFilter : rightFilter
    if (isChecked) {
      originDatas.forEach(data => {
        data.content.includes(filterText) && arr.push(data.id)
      })
    }
    this.setState({
      [this.getSelectedKeysByDir(dir)]: arr
    }, () => {
      this.isLimited(dir)
    })
  }
  isLimited (dir) {
    const { targetList, sourceSelectedKeys } = this.state
    const { targetLimit } = this.props
    this.setState({
      limited: sourceSelectedKeys.length > targetLimit || (sourceSelectedKeys.length + targetList.length > targetLimit)
    })
  }
  searchEvent (dir, e) {
    this.setState({
      [dir + 'Filter']: e.target.value
    })
  }
  renderContainer (dir, datas) {
    const { mode, showAllSelect, searchable } = this.props
    const { emptyContent, sourceSelectedKeys, targetSelectedKeys, leftFilter, rightFilter, limited } = this.state
    const selectedKeys = dir === 'left' ? sourceSelectedKeys : targetSelectedKeys
    const filterText = dir === 'left' ? leftFilter : rightFilter
    const filterResult = datas.filter(item => item.content.includes(filterText))
    const footerCls = classNames(
      'hi-transfer__footer',
      selectedKeys.length !== filterResult.length && selectedKeys.length !== 0 && 'hi-transfer__footer--checkbox-part'
    )
    return <div className='hi-transfer__container'>
      <div className='hi-transfer__title'>
        标题
      </div>
      {
        searchable && <div className='hi-transfer__searchbar'>
          <Icon name='search' />
          <Input placeholder='搜索' onChange={this.searchEvent.bind(this, dir)} value={filterText} />
        </div>
      }
      <div className={`hi-transfer__body ${datas.length === 0 ? 'hi-transfer__body--empty' : ''}`}>
        {
          filterResult.length > 0 ? <ul className='hi-transfer__list'>
            {
              dir === 'left' && limited && (
                <li
                  key='limit-tips'
                  className='hi-transfer__item hi-transfer__item--limit'
                >
                  <div className='hi-transfer__warning' />
                  <span>数量达上限，无法添加</span>
                </li>
              )
            }
            {
              filterResult.map((item, index) => {
                return <li
                  key={index}
                  className='hi-transfer__item'
                  onClick={this.clickItemEvent.bind(this, item, index, dir)}
                >
                  {mode !== 'basic' ? <Checkbox
                    text={item.content}
                    value={item.id}
                    checked={selectedKeys.includes(item.id)}
                    onChange={this.checkboxEvent.bind(this, dir)}
                  /> : item.content}
                </li>
              })
            }
          </ul> : (dir === 'left' ? emptyContent[0] : emptyContent[1])
        }
      </div>
      {
        mode !== 'basic' && showAllSelect && <div className={footerCls}>
          <Checkbox
            text='全选'
            checked={(selectedKeys.length !== 0 && selectedKeys.length === filterResult.length && filterResult.length !== 0)}
            onChange={this.allCheckboxEvent.bind(this, dir)}
          />
          <span>已选：{selectedKeys.length}</span>
        </div>
      }
    </div>
  }
  render () {
    const { mode } = this.props
    const { sourceList, targetList, sourceSelectedKeys, targetSelectedKeys, limited } = this.state
    const operCls = classNames(
      'hi-transfer__operation',
      mode === 'basic' && 'hi-transfer__operation--basic'
    )
    return (
      <div className='hi-transfer'>
        {this.renderContainer('left', sourceList)}
        <div className={operCls}>
          {
            mode !== 'basic' &&
              <React.Fragment>
                <Button
                  type={(sourceSelectedKeys.length === 0 || limited) ? 'default' : 'primary'}
                  icon='right'
                  onClick={this.moveTo.bind(this, 'left')}
                  disabled={(sourceSelectedKeys.length === 0 || limited)}
                />
                <span className='hi-transfer__split' />
                <Button
                  type={targetSelectedKeys.length === 0 ? 'default' : 'primary'}
                  icon='left'
                  onClick={this.moveTo.bind(this, 'right')}
                  disabled={targetSelectedKeys.length === 0}
                />
              </React.Fragment>
          }
        </div>
        {this.renderContainer('right', targetList)}
      </div>
    )
  }
}
Transfer.defaultProps = {
  mode: 'basic',
  targetKeys: [],
  showAllSelect: false,
  searchable: false
}
Transfer.propTypes = {
  mode: PropTypes.oneOf(['basic', 'multiple']),
  showAllSelect: PropTypes.bool,
  searchable: PropTypes.bool,
  targetLimit: PropTypes.number
}
export default Transfer
