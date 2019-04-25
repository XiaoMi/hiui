import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import TreeNode from './TreeNode'
import isEqual from 'lodash/isEqual'
import { getAll, dealData } from './util'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import './style/index'

class Tree extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hasExpanded: [],
      dataMap: {},
      data: [],
      semiChecked: [],
      disabledKeys: [],
      all: [],
      checkedIds: [],
      semiCheckedIds: []
    }
  }

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.any),
    onDragStart: PropTypes.func,
    defaultExpandAll: PropTypes.bool,
    checkable: PropTypes.bool,
    draggable: PropTypes.bool,
    // withLine: PropTypes.bool,
    onNodeClick: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func
  }

  static defaultProps = {
    prefixCls: 'hi-tree',
    defaultCheckedKeys: [],
    data: []
  }

  static getDerivedStateFromProps (props, state) {
    let data = {}
    if (!isEqual(props.data, state.data)) {
      const dataMap = {}
      dealData(props.data, dataMap)
      data.dataMap = dataMap
      data.data = props.data

      if (state.data.length === 0) {
        if (props.defaultExpandAll) {
          let tempExpandedArr = []
          for (let key in dataMap) {
            if (dataMap[key].children && dataMap[key].children.length > 0) {
              tempExpandedArr.push(dataMap[key].id)
            }
          }
          data.hasExpanded = tempExpandedArr
        }
      }
    }

    if (props.data && props.checkedKeys) {
      data.all = getAll(props.data, props.checkedKeys)
    }

    return data
  }

  onCheckChange = (checked, item) => {
    const { onChange, checkedKeys } = this.props
    let checkedArr = checkedKeys

    let { all } = this.state
    let semiChecked = all.filter(item => item.semi).map(item => item.id)
    let disabledKeys = all.filter(item => item.disabled).map(item => item.id)
    let myself = all.find(a => a.id === item.id)
    let children = myself.child
    let parent = myself.parent

    if (semiChecked.includes(item.id)) {
      children.forEach(child => {
        checkedArr = checkedArr.filter(c => c !== child)
      })
      checkedArr = checkedArr.filter(c => c !== item.id)
    } else {
      if (checked) {
        checkedArr = checkedArr.filter(c => c !== item.id)
        children.forEach(child => {
          checkedArr = checkedArr.filter(c => c !== child)
        })
        parent.forEach(p => {
          checkedArr = checkedArr.filter(c => c !== p)
        })
      } else {
        checkedArr = checkedArr.concat(children)
        checkedArr.push(item.id)
        parent.forEach(p => {
          let par = all.find(a => a.id === p).child
          let bool = true
          par.forEach(p => {
            if (!checkedArr.includes(p)) {
              bool = false
            }
          })
          bool && checkedArr.push(p)
        })
      }
    }

    disabledKeys.forEach(d => {
      if (d.checked) {
        if (!checkedArr.includes(d.id)) {
          checkedArr.push(d.id)
        }
      } else {
        checkedArr = checkedArr.filter(c => c !== d.id)
      }
    })

    parent.forEach(p => {
      let child = all.find(item => item.id === p).child
      let semi = false
      let num = 0
      checkedArr.forEach(c => {
        if (child.includes(c)) {
          num = num + 1
        }
      })

      semi = num !== 0 && num !== child.length

      if (semi) {
        if (!semiChecked.includes(p)) {
          semiChecked.push(p)
        }
      } else {
        semiChecked = semiChecked.filter(s => s !== p)
      }
    })

    onChange && onChange(checkedArr, item.title, !checked, semiChecked)
    this.props.onCheckChange &&
      this.props.onCheckChange(checkedArr, item.title, !checked, semiChecked)
  }

  // 展开、收起节点
  onExpanded = (expanded, item) => {
    let expandedArr = [...this.state.hasExpanded]

    if (expandedArr.includes(item.id)) {
      expandedArr.splice(expandedArr.indexOf(item.id), 1)
    } else {
      expandedArr.push(item.id)
    }
    this.setState({
      hasExpanded: expandedArr
    })
  }
  // 展开节点
  expandTreeNode = id => {
    const _hasExpanded = [...this.state.hasExpanded]
    if (!_hasExpanded.includes(id)) {
      _hasExpanded.push(id)
      this.setState({
        hasExpanded: _hasExpanded
      })
    }
  }
  setExpandTreeNodes = ids => {
    this.setState({
      hasExpanded: ids
    })
  }
  closeExpandedTreeNode = id => {
    this.setState({
      hasExpanded: this.state.hasExpanded.filter(expandId => expandId !== id)
    })
  }
  render () {
    const {
      prefixCls,
      checkable,
      closeIcon,
      openIcon,
      // withLine,
      highlightable,
      editable,
      searchable,
      draggable,
      style
    } = this.props
    const { data } = this.state
    return (
      <div className={classNames(`${prefixCls}`)} style={style}>
        <TreeNode
          checked={this.props.checkedKeys || []}
          onNodeClick={this.props.onNodeClick}
          onClick={this.props.onClick}
          semiChecked={this.state.all.filter(item => item.semi).map(item => item.id)}
          expanded={this.state.hasExpanded}
          closeExpandedTreeNode={this.closeExpandedTreeNode}
          expandTreeNode={this.expandTreeNode}
          setExpandTreeNodes={this.setExpandTreeNodes}
          onCheckChange={this.onCheckChange}
          hightLightNodes={this.props.hightLightNodes}
          onHightLightChange={this.props.onHightLightChange}
          onExpanded={this.onExpanded}
          data={data}
          prefixCls={prefixCls}
          checkable={checkable}
          highlightable={highlightable}
          editable={editable}
          searchable={searchable}
          openIcon={openIcon}
          closeIcon={closeIcon}
          // withLine={withLine}
          draggable={draggable}
        />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Tree)
