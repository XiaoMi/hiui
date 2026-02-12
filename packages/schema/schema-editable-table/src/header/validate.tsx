import type { Header } from '@tanstack/react-table'

// NOTE tanstack react-table 内置的表头分组能力实现不完全
// 此处不得不做额外判断：元素有效则作为 th 元素渲染，否则跳过渲染
// FYR: https://tanstack.com/table/v8/docs/framework/react/examples/column-groups
// 上述例子的预览中可以看到现在版本的行合并是不够好用的

type HeaderValidationResult =
  | { isValid: false }
  | {
      isValid: true
      rowSpan: number
      type:
        | 'PLACEHOLDER-NO-PARENT'
        | 'PLACEHOLDER-WITH-PARENT'
        | 'NORMAL-NO-PARENT'
        | 'NORMAL-WITH-PARENT'
    }

export function validateHeaderCell(
  header: Header<AnyObject, unknown>,
  totalHeaderRows: number
): HeaderValidationResult {
  const noParent = header.column.parent === undefined

  // isCrossCol 判断的准确性待进一步验证，目前实测有效
  // crossCol 是指仅有一个子元素的列 // TODO 进一步细化描述
  const isCrossCol = header.subHeaders?.length === 1

  // 占位元素
  if (header.isPlaceholder) {
    // 没有父元素且是交叉列
    if (noParent && isCrossCol) {
      const isFirstRow = header.depth === 1
      if (isFirstRow) {
        return {
          isValid: true,
          rowSpan: totalHeaderRows,
          type: 'PLACEHOLDER-NO-PARENT',
        }
      }
    }

    // 有父元素且是交叉列
    if (!noParent && isCrossCol) {
      const parent = header.column.parent
      if (parent && header.depth - parent.depth <= 2) {
        return {
          isValid: true,
          rowSpan: Math.max(1, totalHeaderRows - header.depth + 1),
          type: 'PLACEHOLDER-WITH-PARENT',
        }
      }
    }
  }
  // 正常元素
  else if (noParent) {
    if (header.depth === 1) {
      return {
        isValid: true,
        rowSpan: 1,
        type: 'NORMAL-NO-PARENT',
      }
    }
  } else {
    const parent = header.column.parent
    if (parent && header.depth - parent.depth <= 2) {
      return {
        isValid: true,
        rowSpan: 1,
        type: 'NORMAL-WITH-PARENT',
      }
    }
  }

  return { isValid: false }
}
