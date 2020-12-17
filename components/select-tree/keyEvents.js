import { getNodeByIdTitle, getChildrenNodes, getParentNode } from './components/tree/util'

/**
 * 移动节点函数
 * @param {String} direction 移动方向 up | down
 * @param {String | number} activeId 当前选中的节点ID
 * @param {Object } selectTreeRoot 根节点
 */
export const moveFocusedIndex = (direction, activeId, selectTreeRoot) => {
  const allSelectTreeNodes = document.querySelectorAll('*[data-selecttree-id]')
  let focusedIndex = 0
  let _activeId = activeId
  allSelectTreeNodes.forEach((ele, index) => {
    const id = ele.getAttribute('data-selecttree-id')
    if (_activeId === id) {
      focusedIndex = index
    }
  })
  if (direction === 'down') {
    focusedIndex++
    _activeId = allSelectTreeNodes[focusedIndex]
      ? allSelectTreeNodes[focusedIndex].getAttribute('data-selecttree-id')
      : allSelectTreeNodes[(focusedIndex = 0)].getAttribute('data-selecttree-id')
  } else {
    focusedIndex--
    _activeId = allSelectTreeNodes[focusedIndex]
      ? allSelectTreeNodes[focusedIndex].getAttribute('data-selecttree-id')
      : allSelectTreeNodes[(focusedIndex = allSelectTreeNodes.length - 1)].getAttribute('data-selecttree-id')
  }
  if (selectTreeRoot.current) {
    selectTreeRoot.current.scrollTop = (focusedIndex - 6) * 36
  }
  return _activeId
}

/**
 * @typedef {Object} RightOrLeftHandleParam 左右键处理函数参数
 * @property {Number | String} activeId 当前选中的节点ID
 * @property {Array} flattenData 被拉平的数据
 * @property {Array: Object} expandIds 展开的节点数据
 * @property {Function} expandEvents 展开处理函数
 * @property {Function} setActiveId 设置选中节点ID
 * @property {String} mode normal | breadcrumb
 */
/**
 * 右方向键处理函数
 * @param {RightOrLeftHandleParam} RightOrLeftHandleParam RightOrLeftHandleParam
 */
export const rightHandle = ({ activeId, flattenData, expandIds, expandEvents, setActiveId }) => {
  const node = getNodeByIdTitle(activeId, flattenData)
  const isExpand = expandIds.includes(node.id)
  const childNodes = getChildrenNodes(node, flattenData)
  if (!isExpand) {
    expandEvents(node, !isExpand)
  } else {
    // 跳到第一个子节点
    childNodes && childNodes.length > 0 && setActiveId(childNodes[0].id)
  }
}
/**
 * 左方向键处理函数
 * @param {RightOrLeftHandleParam} RightOrLeftHandleParam RightOrLeftHandleParam
 */
export const leftHandle = ({ activeId, flattenData, expandIds, expandEvents, setActiveId }) => {
  const node = getNodeByIdTitle(activeId, flattenData)
  const isExpand = expandIds.includes(node.id)
  const parentNodes = getParentNode(node, flattenData)
  if (isExpand) {
    expandEvents(node, !isExpand)
  } else {
    // 跳到其父节点
    parentNodes && parentNodes.id && setActiveId(parentNodes.id)
  }
}
