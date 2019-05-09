import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../button'
import Checkbox from '../checkbox'
import './style/index'

class Transfer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sourceList: [],
      targetList: [],
      sourceSelectedKeys: [],
      targetSelectedKeys: [],
      emptyContent: ['暂无数据', '暂无数据']
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

  getListBydir (dir) {
    return dir === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys'
  }
  clickItemEvent (item, index, dir) {
    const { mode, targetKeys } = this.props
    const { sourceSelectedKeys, targetSelectedKeys } = this.state
    const selectedItem = dir === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys]
    const selectedIndex = selectedItem.indexOf(item.id)

    if (mode === 'basic') {
      if (selectedIndex > -1) {
        selectedItem.splice(selectedIndex, 1)
      } else {
        selectedItem.push(item.id)
      }
      const newTargetKeys = dir === 'left' ? selectedItem.concat(targetKeys) : targetKeys.filter(tk => selectedItem.indexOf(tk) === -1)
      this.setState({
        [this.getListBydir(dir)]: newTargetKeys
      }, () => {
        this.props.onChange(newTargetKeys)
        this.setState({
          [this.getListBydir(dir)]: []
        })
      })
    }
  }
  checkboxEvent (dir, value, isChecked) {
    const { sourceSelectedKeys, targetSelectedKeys } = this.state
    const selectedItem = dir === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys]
    const selectedIndex = selectedItem.indexOf(value)
    if (selectedIndex > -1) {
      selectedItem.splice(selectedIndex, 1)
    } else {
      selectedItem.push(value)
    }
    this.setState({
      [dir === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys']: selectedItem
    })
  }
  moveTo (dir) {
    const { targetKeys } = this.props
    const { sourceSelectedKeys, targetSelectedKeys } = this.state
    const selectedItem = dir === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys]
    const newTargetKeys = dir === 'left' ? selectedItem.concat(targetKeys) : targetKeys.filter(tk => selectedItem.indexOf(tk) === -1)
    this.setState({
      [this.getListBydir(dir)]: newTargetKeys
    }, () => {
      this.props.onChange(newTargetKeys)
      console.log(this.state.sourceList)
      this.setState({
        [this.getListBydir(dir)]: []
      })
    })
  }

  renderEl (dir, datas) {
    const { mode, showAllSelect } = this.props
    const { emptyContent, sourceSelectedKeys, targetSelectedKeys } = this.state
    const sks = dir === 'left' ? sourceSelectedKeys : targetSelectedKeys
    return <div className='hi-transfer__container'>
      <div className='hi-transfer__title'>
        标题
      </div>
      <div className={`hi-transfer__body ${datas.length === 0 ? 'hi-transfer__body--empty' : ''}`}>
        {
          datas.length > 0 ? <ul className='hi-transfer__list'>
            {
              datas.map((item, index) => {
                return <li
                  key={index}
                  className='hi-transfer__item'
                  onClick={this.clickItemEvent.bind(this, item, index, dir)}
                >
                  {mode !== 'basic' ? <Checkbox
                    text={item.content}
                    value={item.id}
                    checked={sks.includes(item.id)}
                    onChange={this.checkboxEvent.bind(this, dir)}
                  /> : item.content}
                </li>
              })
            }
          </ul> : (dir === 'left' ? emptyContent[0] : emptyContent[1])
        }
      </div>
      {
        mode !== 'basic' && showAllSelect && <div className='hi-transfer__footer'>
          <input type='checkbox' />
          <span>已选：2</span>
        </div>
      }
    </div>
  }
  render () {
    const { mode } = this.props
    const { sourceList, targetList, sourceSelectedKeys, targetSelectedKeys } = this.state
    return (
      <div className='hi-transfer'>
        {this.renderEl('left', sourceList)}
        <div className='hi-transfer__operation'>
          {
            mode !== 'basic' ? (
              <React.Fragment>
                <Button
                  type={sourceSelectedKeys.length === 0 ? 'default' : 'primary'}
                  icon='right'
                  onClick={this.moveTo.bind(this, 'left')}
                  disabled={sourceSelectedKeys.length === 0}
                />
                <span className='hi-transfer__split' />
                <Button
                  type={targetSelectedKeys.length === 0 ? 'default' : 'primary'}
                  icon='left'
                  onClick={this.moveTo.bind(this, 'right')}
                  disabled={targetSelectedKeys.length === 0}
                />
              </React.Fragment>
            ) : (
              <Button type='default' icon='right' />
            )
          }
        </div>
        {this.renderEl('right', targetList)}
      </div>
    )
  }
}
Transfer.defaultProps = {
  mode: 'basic',
  targetKeys: [],
  showAllSelect: false
}
Transfer.propTypes = {
  mode: PropTypes.oneOf(['basic', 'multiple']),
  showAllSelect: PropTypes.bool
}
export default Transfer
