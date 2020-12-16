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
