import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import find from 'lodash/find'
import { toggleSlide, calcDropPosition, insBefore, insAfter, insChild, deepClone } from './util'

const DEFAULT_TITLE = '---'

// 记录是否已经触发收起展开操作 防止闪烁
let isTriggerSlide = false

class Tree extends Component {
  constructor (props) {
    super(props)
    this.isInitial = true
    this.isDataUpdate = false
    this.state = {
      checkedTree: {}
    }
  }
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.any),
    onNodeToggle: PropTypes.func,
    onDragStart: PropTypes.func,
    render: PropTypes.func,
    defaultExpandAll: PropTypes.bool,
    checkable: PropTypes.bool,
    draggable: PropTypes.bool,
    options: PropTypes.object,
    onNodeClick: PropTypes.func
  }
  static defaultProps = {
    prefixCls: 'hi-tree',
    defaultExpandAll: false,
    checkable: false,
    draggable: false,
    options: {
      title: 'title',
      children: 'children'
    },
    openIcon: null,
    closeIcon: null,
    onNodeClick: () => {}
  }
  componentWillMount () {
    // init checkedTree
    const { data } = this.props

    this.setState({
      checkedTree: this.formatDataIntoCheckedTree(data)
    })
  }

  componentWillReceiveProps (nextProps) {
    // if (nextProps.data !== this.props.data) {
    //   // update checkTree
    //   this.isDataUpdate = true

    //   const data = this.formatDataIntoTree(nextProps.data, nextProps.dataType)
    //   this.setState({
    //     checkedTree: this.formatDataIntoCheckedTree(data)
    //   })
    // }
  }

  // 检查节点展开状态
  isExpanded = (node) => {
    return !node.parentNode.classList.contains('off')
  }
  // 三角按钮点击事件
  handleExpandClick = (root, e) => {
    const {
      openIcon,
      closeIcon
    } = this.props
    if (!isTriggerSlide) {
      const { onNodeToggle } = this.props
      const switcher = e.target
      const switcherParent = switcher.parentNode
      const switcherClassList = switcher.classList
      let remove = `icon-${openIcon || 'plus'}`
      let add = `icon-${closeIcon || 'minus'}`

      switcherParent.classList.toggle('off')
      if (switcherParent.classList.contains('off')) {
        remove = `icon-${closeIcon || 'minus'}`
        add = `icon-${openIcon || 'plus'}`
      }
      switcherClassList.add(add)
      switcherClassList.remove(remove)

      const isClose = !this.isExpanded(switcher)
      const el = switcherParent.nextSibling// 获取到子树节点
      // 如果没有子树节点 移除当前节点的三角按钮
      if (!(el && switcherParent.nextSibling.childNodes.length)) {
        // switcher.remove()
        return
      }

      if (onNodeToggle) {
        onNodeToggle({ data: root, isExpanded: !isClose })
      }
      isTriggerSlide = true
      toggleSlide(el, isClose, () => { isTriggerSlide = false })
    }
  }
  // checkbox点击事件
  handleCheckboxClick = (root) => {
    const { onChange } = this.props
    const { checkedTree } = this.state

    this.updateCheckedTree(root.id, checkedTree[root.id].t !== 2 ? 2 : 0)
    onChange && onChange(root)
  }

  updateCheckedTree = (id, type) => {
    const checkedTree = deepClone(this.state.checkedTree)
    const parentId = checkedTree[id].p
    const childrenId = Object.keys(checkedTree).filter(
      x => checkedTree[x].p === id.toString()
    )
    checkedTree[id].t = type

    this.updateUpstream(parentId, type, checkedTree)
    childrenId.forEach(childId => {
      this.updateDownstream(childId, type, checkedTree)
    })

    this.setState({ checkedTree })
  }

  updateUpstream = (id, type, checkedTree) => {
    if (!id) return
    if (type === 2) {
      checkedTree[id].t = Object.keys(checkedTree)
        .filter(x => checkedTree[x].p === id)
        .every(x => checkedTree[x].t === 2)
        ? 2
        : 1
    } else if (type === 1) {
      checkedTree[id].t = 1
    } else if (type === 0) {
      checkedTree[id].t = Object.keys(checkedTree)
        .filter(x => checkedTree[x].p === id)
        .every(x => checkedTree[x].t === 0)
        ? 0
        : 1
    }
    if (checkedTree[id].p) {
      this.updateUpstream(checkedTree[id].p, checkedTree[id].t, checkedTree)
    }
  }

  updateDownstream = (id, type, checkedTree) => {
    if (!id) return
    checkedTree[id].t = type
    const childrenId = Object.keys(checkedTree).filter(
      x => checkedTree[x].p === id
    )
    if (childrenId.length > 0) {
      childrenId.forEach(childId => {
        this.updateDownstream(childId, type, checkedTree)
      })
    }
  }

  updateCheckedTreeRecursive = (root, parentId, func) => {
    func(root, parentId)
    if (root.children && root.children.length > 0) {
      root.children.forEach(child => {
        this.updateCheckedTreeRecursive(child, root.id, func)
      })
    }
  }

  initialCheckedTree = (data) => {
    let newCheckedTree = {}
    const { defaultCheckedKeys } = this.props

    data.forEach(tree => {
      this.updateCheckedTreeRecursive(tree, '', (root, parentId) => {
        const isSetDefault =
          defaultCheckedKeys &&
          find(defaultCheckedKeys, x => x === root.id) >= 0
        newCheckedTree[root.id] = {
          p: parentId.toString(),
          t: isSetDefault ? 2 : 0
        }
      })
    })
    return newCheckedTree
  }

  formatDataIntoCheckedTree = (data) => {
    let checkedTree = {}
    if (this.isInitial) {
      checkedTree = this.initialCheckedTree(data)
      this.isInitial = false
    } else if (this.isDataUpdate) {
      checkedTree = this.reloadCheckedTree(data)
      this.isDataUpdate = false
    }
    this.updateWholeCheckedTree(checkedTree)
    return checkedTree
  }

  updateWholeCheckedTree (checkedTree) {
    Object.keys(checkedTree).forEach(id => {
      if (checkedTree[id].t === 2) {
        this.updateUpstream(id, 2, checkedTree)
        this.updateDownstream(id, 2, checkedTree)
      }
    })
  }

  // 当拖拽元素开始被拖拽的时候触发的事件
  onDragStart = (e) => {
    const { onDragStart } = this.props
    const current = e.target.parentNode.parentNode// li
    e.stopPropagation()
    const nodeName = e.target.nodeName
    if (nodeName === 'A' || nodeName === 'IMG') {
      e.preventDefault()
    }

    if (current.parentNode.childNodes.length === 1) {
      current.parentNode.parentNode.classList.add('switcher-none')
    }
    this.dargNode = e.target
    if (onDragStart) {
      onDragStart(e)
    }

    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer.setData('text/plain', '')
    } catch (error) {
      // empty
    }
  }
  // 当拖拽完成后触发的事件
  onDragEnd = (e) => {
    const { onDragEnd } = this.props
    e.stopPropagation()

    if (onDragEnd) {
      onDragEnd(e)
    }
  }

  // 当拖曳元素进入目标元素的时候触发的事件
  onDragEnter = (e) => {
    const { onDragEnter } = this.props
    const curLi = e.currentTarget
    let dropPosition = calcDropPosition(e, e.currentTarget)

    e.preventDefault()
    e.stopPropagation()

    setTimeout(() => {
      if (dropPosition === -1) {
        curLi.classList.add('gap-top')
      } else if (dropPosition === 0) {
        curLi.classList.add('gap-enter')
      } else if (dropPosition === 1) { // bottom
        curLi.classList.add('gap-bottom')
      }
      this.dropPosition = dropPosition
      // this.setState({ dropPosition })
    }, 0)

    if (onDragEnter) {
      onDragEnter({ event: e, dropPosition })
    }
  }
  // 拖拽元素在目标元素上移动的时候触发的事件
  onDragOver = (e) => {
    const { onDragOver } = this.props
    e.preventDefault()
    e.stopPropagation()

    if (onDragOver) {
      onDragOver(e)
    }
  }
  // 当拖拽元素离开目标元素时触发
  onDragLeave = (e) => {
    const { onDragLeave } = this.props
    e.stopPropagation()
    const curLi = e.currentTarget
    curLi.classList.remove('gap-top', 'gap-enter', 'gap-bottom')

    if (onDragLeave) {
      onDragLeave(e)
    }
  }
  // 被拖拽的元素在目标元素上同时鼠标放开触发的事件
  onDrop = (e) => {
    const { onDrop } = this.props
    const dropPosition = this.dropPosition
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('gap-top', 'gap-enter', 'gap-bottom')

    if (dropPosition === -1) { // top
      insBefore(this.dargNode, e.currentTarget)
    } else if (dropPosition === 0) {
      insChild(this.dargNode, e.currentTarget)
    } else if (dropPosition === 1) { // bottom
      insAfter(this.dargNode, e.currentTarget)
    }
    if (onDrop) {
      onDrop(e)
    }
  }

  // 生成三角按钮
  renderSwitcher = (root, isShowChildren) => {
    const { prefixCls, openIcon, closeIcon } = this.props
    const switcherClsName = classNames(`${prefixCls}-switcher`, 'hi-icon', `icon-${isShowChildren ? (closeIcon || 'minus') : (openIcon || 'plus')}`)
    return (
      <i
        className={switcherClsName}
        onClick={this.handleExpandClick.bind(this, root)}
      />
    )
  }
  // 生成checkbox
  renderCheckbox = (root) => {
    // const { disabledCheckedKeys } = this.props
    const { prefixCls } = this.props

    return (
      <React.Fragment>
        <input
          className={`${prefixCls}-input`}
          type='checkbox'
          onChange={this.handleCheckboxClick.bind(this, root)}
          checked={this.state.checkedTree[root.id].t === 2}
        />
        <span className={`${prefixCls}-checkbox`} />
      </React.Fragment>
    )
  }
  // 生成树节点内容 bar（icon + title）
  renderNodeContent = (root) => {
    const { prefixCls, draggable, options, render, checkable, onNodeClick } = this.props

    return (
      <div
        draggable={draggable || undefined}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        className={`${prefixCls}-node`}
      >
        <label>
          {checkable && this.renderCheckbox(root)}
          {render ? render(root) : (<div className={`${prefixCls}-title`}
            style={root.style}
            onClick={() => {
              onNodeClick && onNodeClick(root)
              root.onClick && root.onClick(root)
            }}
          >{root[options.title] || DEFAULT_TITLE}</div>)}
        </label>
      </div>
    )
  }
  // 生成子树
  renderChildren = (root, isShowChildren) => {
    const { prefixCls, options } = this.props

    return (
      root[options.children] && root[options.children].length > 0 && (
        <ul
          key={`ul-${root.id}`}
          className={`${prefixCls}-child`}
          style={isShowChildren ? {} : { display: 'none' }}
        >
          {this.renderTreeNodes(root[options.children])}
        </ul>
      )
    )
  }

  // 渲染树节点
  renderTreeNodes = (data) => {
    const { prefixCls, defaultExpandAll, options } = this.props

    if (data && data.length > 0) {
      return data.map((root, index) => {
        // 单独节点expand属性具有最高优先级，如果expand没有设置会根据expandAll为准
        let isShowChildren = defaultExpandAll
        if (root.expand) {
          isShowChildren = root.expand
        }

        const barClassName = classNames(`${prefixCls}-bar`, {
          'off': !isShowChildren// off：关闭状态
        })

        return (
          <li
            className={(root[options.children] && root[options.children].length > 0) ? '' : 'switcher-none'}
            key={root.id + '' + index}
          >
            <div
              onDragEnter={this.onDragEnter}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
              onDrop={this.onDrop}
              className={barClassName}
            >
              {
                root.children
                  ? this.renderSwitcher(root, isShowChildren)
                  : ''
              }
              {this.renderNodeContent(root)}
            </div>
            {this.renderChildren(root, isShowChildren)}
          </li>
        )
      })
    }
  }

  render () {
    const { prefixCls, data, draggable, style } = this.props
    const treeNodes = this.renderTreeNodes(data)
    const classes = classNames(`${prefixCls}`, {
      'draggable-tree': draggable
    })

    return (
      <div className={classes}
        style={style}
      >
        <ul className={`${prefixCls}-child`} ref='rootNode'>
          {treeNodes}
        </ul>
      </div>
    )
  }
}

export default Tree
