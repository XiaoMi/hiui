import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import TreeNode from './TreeNode'
import isEqual from 'lodash/isEqual'
import { deepClone, getChildren, getDisabled, getAll, dealData } from './util'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import './style/index'

class Tree extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hasChecked: props.defaultCheckedKeys,
      hasExpanded: [],
      dataMap: {},
      data: [],
      dragNode: '',
      dragNodePosition: null,
      semiChecked: [],
      disabledKeys: [],
      all: []
    }
  }

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.any),
    onDragStart: PropTypes.func,
    defaultExpandAll: PropTypes.bool,
    checkable: PropTypes.bool,
    draggable: PropTypes.bool,
    withLine: PropTypes.bool,
    onNodeClick: PropTypes.func,
    onClick: PropTypes.func,
    onChange: PropTypes.func
  }

  static defaultProps = {
    prefixCls: 'hi-tree',
    defaultCheckedKeys: [],
    data: []
  }

  static getDerivedStateFromProps (props, prevState) {
    let data = {}
    if (!isEqual(props.data, prevState.data)) {
      const dataMap = {}
      dealData(deepClone(props.data), dataMap)
      console.log(props.data, prevState.data, dataMap)
      data.dataMap = dataMap
      data.data = props.data

      if (prevState.data.length === 0) {
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
      console.log(
        'chedked',
        checked,
        'child',
        child,
        'checkedkeys',
        checkedArr,
        'child.length',
        child.length,
        'title',
        all.find(item => item.id === p).title,
        'checknum',
        num,
        'semi',
        semi
      )
    })

    onChange && onChange(checkedArr, item.title, !checked, semiChecked)
    this.props.onCheckChange &&
      this.props.onCheckChange(checkedArr, item.title, !checked, semiChecked)
  }

  setCheckTreeCheckedChild (id, checked, tempCheckedArr, semi) {
    let child = getChildren(this.props.data, id)
    let disabled = getDisabled(this.props.data)
    child.forEach(c => {
      if (disabled.includes(c)) {
        return
      }
      if (semi) {
        tempCheckedArr.splice(tempCheckedArr.indexOf(c), 1)
        return
      }
      if (!tempCheckedArr.includes(c) && !disabled.includes(c)) {
        tempCheckedArr.push(c)
      } else {
        tempCheckedArr.splice(tempCheckedArr.indexOf(c), 1)
      }
    })
  }

  setCheckTreeCheckedParent (id, checked, tempCheckedArr) {
    const { dataMap } = this.state
    if (checked) {
      if (tempCheckedArr.indexOf(id) >= 0) {
        tempCheckedArr.splice(tempCheckedArr.indexOf(id), 1)
      }
    } else {
      let allChecked = true

      dataMap[id].children &&
        dataMap[id].children.map(i => {
          if (tempCheckedArr.indexOf(i) < 0) {
            allChecked = false
          }
        })
      if (allChecked && tempCheckedArr.indexOf(id) < 0) {
        tempCheckedArr.push(id)
      }
    }
    if (dataMap[id].parent) {
      this.setCheckTreeCheckedParent(dataMap[id].parent, checked, tempCheckedArr)
    }
  }

  onExpanded (expanded, item) {
    let expandedArr = this.state.hasExpanded

    if (expandedArr.indexOf(item.id) >= 0) {
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
    const _hasExpanded = this.state.hasExpanded
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

  renderTreeNodes (data) {
    const {
      prefixCls,
      checkable,
      closeIcon,
      openIcon,
      withLine,
      highlightable,
      editable,
      searchable,
      draggable
    } = this.props
    console.log('123', draggable)
    return (
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
        onExpanded={this.onExpanded.bind(this)}
        data={data}
        prefixCls={prefixCls}
        checkable={checkable}
        highlightable={highlightable}
        editable={editable}
        searchable={searchable}
        openIcon={openIcon}
        closeIcon={closeIcon}
        withLine={withLine}
        draggable={draggable}
      />
    )
  }

  render () {
    const { prefixCls, draggable, style } = this.props
    const classes = classNames(`${prefixCls}`, {
      'draggable-tree': draggable
    })

    return (
      <div className={classes} style={style}>
        {this.renderTreeNodes(this.state.data)}
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Tree)
