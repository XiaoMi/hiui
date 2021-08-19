import React, { useRef, useState, useEffect } from 'react'
import Popper from '../../popper'

const prefix = 'hi-table-advanceheader-customfilter'

const CustomFilter = ({ columnData }) => {
  const popperAttachEle = useRef()

  const {
    filterIcon,
    filterDropdown,
    filterDropdownWidth,
    onFilterDropdownVisibleChange,
    filterDropdownClassName
  } = columnData
  // 弹出层显示隐藏
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false)
  useEffect(() => {
    onFilterDropdownVisibleChange && onFilterDropdownVisibleChange(filterDropdownVisible, columnData)
  }, [filterDropdownVisible])
  const renderFilter = () => {
    return filterDropdown({ columnData, setFilterDropdownVisible })
  }
  return (
    <div className={prefix}>
      <div className={`${prefix}-icon`} ref={popperAttachEle} onClick={() => setFilterDropdownVisible(true)}>
        {filterIcon}
      </div>
      <Popper
        // 弹出层的显示隐藏
        show={filterDropdownVisible}
        // 依附的元素
        leftGap={-(filterDropdownWidth - 16) || -(150 - 16)}
        attachEle={popperAttachEle.current}
        overlayClassName={filterDropdownClassName}
        // 点击弹出层以及依附元素以外的区域时会触发该回调
        onClickOutside={() => {
          setFilterDropdownVisible(false)
        }}
      >
        <div className={`${prefix}-content`} style={{ width: filterDropdownWidth || 150 }}>
          {filterDropdownVisible && renderFilter()}
        </div>
      </Popper>
    </div>
  )
}
export default CustomFilter
