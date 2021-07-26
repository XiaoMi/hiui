import React, { useState, useContext, useEffect, useCallback } from 'react'
import Cell from './Cell'
import TableContext from './context'
import classNames from 'classnames'
import _ from 'lodash'
import Checkbox from '../checkbox'
import Loading from '../loading'
import Icon from '../icon'
import { flatTreeData, setDepth } from './util'
import IconLoading from './LoadingIcon'
import Expandcol from './Expandcol'
const Row = ({
  rowData,
  allRowData,
  level,
  showColHighlight,
  hoverColIndex,
  setHoverColIndex,
  expandedTree,
  expandedTreeRows,
  setExpandedTreeRows,
  isFixed,
  isSumRow, // 是否为合计行
  isAvgRow, // 是否为平均行
  index,
  innerRef,
  rowHeight,
  isTree,
  dragStatus,
  setDragStatus,
  dragRowKey,
  setDragRowKey,
  expanded: propsExpanded
}) => {
  const [expanded, setExpanded] = useState(propsExpanded || false)
  useEffect(() => {
    setExpanded(propsExpanded)
  }, [propsExpanded])
  const {
    errorRowKeys,
    rowSelection,
    highlightedRowKeys,
    setHighlightRows,
    columns,
    expandedRender,
    hoverRow,
    prefix,
    rowExpandable,
    onExpand,
    disabledData,
    draggable,
    onDragStart,
    dargInfo
  } = useContext(TableContext)
  const _columns = _.cloneDeep(columns)
  const depthArray = []
  setDepth(_columns, 0, depthArray)
  const rowColumns = flatTreeData(_columns).filter((col) => col.isLast)
  const isSticky = rowColumns.some((item) => {
    return typeof item.leftStickyWidth !== 'undefined' || typeof item.rightStickyWidth !== 'undefined'
  })
  const checkboxConfig = rowSelection && rowSelection.getCheckboxConfig && rowSelection.getCheckboxConfig(allRowData)
  const checkboxDisabled = (checkboxConfig && checkboxConfig.disabled) || false
  checkboxDisabled && disabledData.current.push(allRowData.key)
  const rowExpand = rowExpandable && rowExpandable(rowData)
  const [dropHightLineStatus, setDropHightLineStatus] = useState(null)
  const rowKey = allRowData.key

  const onDragStartCallback = useCallback(
    (e) => {
      const clientY = e.clientY
      dargInfo.current = {
        startClientY: clientY,
        dragKey: rowKey,
        level: level,
        rowData: allRowData
      }
      onDragStart && onDragStart(allRowData)
      setDragStatus(true)
      setDragRowKey(rowKey)
    },
    [allRowData, dragStatus, dragRowKey, onDragStart]
  )

  const onDragEnter = useCallback(
    (e) => {
      const { startClientY, dragKey } = dargInfo.current
      const clienY = e.clientY
      dargInfo.current = {
        ...dargInfo.current,
        dropKey: rowKey,
        dropClientY: clienY,
        dropRowData: allRowData
      }
      dragKey !== rowKey && setDropHightLineStatus(clienY < startClientY ? 'top' : 'bottom')
    },
    [rowKey, dropHightLineStatus]
  )

  return [
    <tr
      style={isFixed && rowHeight ? { height: rowHeight } : {}}
      ref={innerRef}
      id={rowKey}
      draggable={draggable}
      onMouseMove={() => {
        setDragRowKey(null)
        setDragStatus(false)
      }}
      onDragStart={onDragStartCallback}
      onDragEnd={() => {
        dargInfo.current = {}
        setDropHightLineStatus(null)
      }}
      onDragEnter={onDragEnter}
      onDragOver={(e) => {
        e.preventDefault()
      }}
      onDragLeave={() => {
        setDropHightLineStatus(null)
      }}
      className={classNames(`${prefix}__row`, {
        [`${prefix}__row--error`]: errorRowKeys.includes(rowData.key),
        [`${prefix}__row--highlight`]: hoverRow === rowData.key || highlightedRowKeys.includes(rowData.key),
        [`${prefix}__row--total`]: isSumRow,
        [`${prefix}__row--draggable`]: draggable,
        [`${prefix}__row--draging`]: dragRowKey === rowKey,
        [`${prefix}__row--draggable__border--top`]:
          typeof dargInfo.current.dropKey !== 'undefined' && dropHightLineStatus === 'top',
        [`${prefix}__row--draggable__border--bottom`]:
          typeof dargInfo.current.dropKey !== 'undefined' && dropHightLineStatus === 'bottom',
        [`${prefix}__row--avg`]: isAvgRow
      })}
      key="row"
      onDoubleClick={(e) => {
        if (highlightedRowKeys.includes(rowData.key)) {
          setHighlightRows(highlightedRowKeys.filter((r) => r !== rowData.key))
        } else {
          setHighlightRows(highlightedRowKeys.concat(rowData.key))
        }
      }}
    >
      {rowSelection && isFixed !== 'right' && !isSumRow && !isAvgRow && (
        <td
          style={{ width: 50 }}
          className={classNames({
            [`${prefix}__col--sticky`]: isSticky
          })}
        >
          <Checkbox
            checked={rowSelection.selectedRowKeys.includes(rowData.key)}
            disabled={checkboxDisabled}
            onChange={(e) => {
              const { selectedRowKeys = [], onChange } = rowSelection
              const _selectedRowKeys = [...selectedRowKeys]
              if (_selectedRowKeys.includes(rowData.key)) {
                onChange(_selectedRowKeys.filter((key) => key !== rowData.key))
              } else {
                _selectedRowKeys.push(rowData.key)
                onChange(_selectedRowKeys)
              }
            }}
          />
        </td>
      )}
      {expandedRender && (
        <td
          style={{ width: 50 }}
          className={classNames({
            [`${prefix}__col--sticky`]: isSticky
          })}
        >
          <>
            {React.isValidElement(rowExpand) ? (
              rowExpand
            ) : (
              <>
                {expanded !== 'loading' && rowExpand ? (
                  <Icon
                    style={{ cursor: 'pointer' }}
                    name={expanded ? 'down' : 'right'}
                    onClick={() => {
                      if (propsExpanded === undefined) {
                        setExpanded(!expanded)
                      }
                      if (onExpand) {
                        onExpand(!expanded, rowData)
                      }
                    }}
                  />
                ) : (
                  rowExpand && <IconLoading />
                )}
              </>
            )}
          </>
        </td>
      )}

      {rowColumns.map((column, idx) => (
        <Cell
          key={idx}
          column={column}
          rowData={rowData}
          allRowData={allRowData}
          showColHighlight={showColHighlight}
          hoverColIndex={hoverColIndex}
          setHoverColIndex={setHoverColIndex}
          level={level}
          columnIndex={idx}
          rowIndex={index}
          isTree={isTree}
          expandedTree={expandedTree}
          expandedTreeRows={expandedTreeRows}
          setExpandedTreeRows={setExpandedTreeRows}
        />
      ))}
    </tr>,
    // 可展开的内嵌部分
    expandedRender && expanded && (
      <tr key="expanded-row" className={`${prefix}--expanded`} style={{ background: 'rgba(251,251,251,1)' }}>
        {/* 多选占位 */}
        {rowSelection && <td />}
        {/* 可展开内嵌显示 */}
        <td colSpan={columns.length + 1} style={{ color: '#666666' }}>
          <Expandcol rowData={rowData} index={index} expandedRender={expandedRender} setExpanded={setExpanded} />
          {expanded === 'loading' && <Loading size="small" />}
        </td>
      </tr>
    )
  ]
}

export default Row
