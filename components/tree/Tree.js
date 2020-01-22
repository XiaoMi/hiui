import React, { Component } from 'react'
import classNames from 'classnames'
import Provider from '../context'
import TreeNode from './TreeNode'
import isEqual from 'lodash/isEqual'
import { getAll, dealData } from './util'
import withDragDropContext from '../lib/withDragDropContext'
import './style/index'

export class Tree extends Component {
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

  static defaultProps = {
    prefixCls: 'hi-tree',
    defaultCheckedKeys: [],
    data: [],
    apperance: 'default',
    contextMenu: []
  }

  static getDerivedStateFromProps (props, state) {
    let data = {}
    if (!isEqual(props.data, state.data)) {
      const dataMap = {}
      dealData(props.data, dataMap)
      data.dataMap = dataMap
      data.data = props.data

      if (state.data.length === 0) {
        let defaultExpandedArr = []

        for (let key in dataMap) {
          const item = dataMap[key]
          const itemHasChildren = item.children && item.children.length > 0
          const itemShouldExpand =
            (props.defaultExpandAll && item.expanded !== false) || item.expanded === true
          if (itemHasChildren && itemShouldExpand) {
            defaultExpandedArr.push(item.id)
          }
        }
        data.hasExpanded = defaultExpandedArr
      }
    }

    if (props.data && props.checkedIds) {
      data.all = getAll(props.data, props.checkedIds)
    }

    return data
  }

  onCheckChange = (checked, item) => {
    const { onChange, checkedIds, onCheckChange, onCheck } = this.props
    let checkedArr = checkedIds

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
      checkedArr = checkedArr.filter(c => c !== d.id)
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
    onCheckChange && onCheckChange(checkedArr, item.title, !checked, semiChecked)
    onCheck && onCheck(checkedArr, item, !checked, semiChecked)
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
    this.props.onExpand && this.props.onExpand(expanded, expandedArr, item)
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
      highlightable,
      editable,
      searchable,
      draggable,
      style,
      loadTreeNode,
      onDragStart,
      onDrop,
      onDropEnd,
      onDelete,
      onSave,
      onClick,
      apperance,
      contextMenu,
      theme
    } = this.props
    const { data } = this.state
    return (
      <div
        className={classNames(`${prefixCls}`, `theme__${theme}`, { 'hi-tree--show-line': apperance === 'line' })}
        style={style}
      >
        <TreeNode
          origin={loadTreeNode}
          showLine={apperance === 'line'}
          apperance={apperance}
          checked={this.props.checkedIds || []}
          onClick={onClick}
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
          theme={theme}
          prefixCls={prefixCls}
          checkable={checkable}
          highlightable={highlightable}
          editable={editable}
          searchable={searchable}
          openIcon={openIcon}
          closeIcon={closeIcon}
          draggable={draggable}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onDropEnd={onDropEnd}
          onDelete={onDelete}
          onSave={onSave}
          contextMenu={contextMenu}
        />
      </div>
    )
  }
}

const HOCTree = TreeComponent => {
  return class WrapperTree extends Component {
    render () {
      const { draggable } = this.props
      const DraggableTree = withDragDropContext(Tree)
      return draggable ? <DraggableTree {...this.props} /> : <TreeComponent {...this.props} />
    }
  }
}
export default Provider(HOCTree(Tree))
