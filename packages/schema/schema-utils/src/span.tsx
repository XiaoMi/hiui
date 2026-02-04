import { set } from 'lodash-es'

type FieldTracker = {
  startIndex: number
  currentValue: unknown
  count: number
}

/**
 * setRowSpanForFields 的额外配置选项
 */
export interface SetRowSpanExtraOpts {
  /**
   * 主字段名（用于分组）
   * 当指定主字段时，会先按主字段分组，然后在每个分组内部处理其他字段的行合并
   * 这样可以确保其他字段的合并不会跨越主字段的分组边界
   */
  mainField?: string
}

/**
 * 根据指定字段为表格数据设置行合并属性
 *
 * 功能：根据传入的字段列表，计算每个字段的连续相同值，并为首行设置行合并属性
 *
 * 实现原理：
 * 1. 只需对数据进行一次遍历，为每个字段跟踪当前分组信息
 * 2. 当字段值发生变化或到达数组末尾时，为当前分组设置行合并属性
 * 3. 对于每个分组，第一行设置rowSpan=分组行数，其余行设置rowSpan=0
 * 4. 对于字段值为undefined或null的行，会被视为独立行，不参与行合并
 *
 * 性能：O(n * m) 时间复杂度，其中n是数据行数，m是字段数量
 *
 * @param data 表格数据数组（会被直接修改）
 * @param fields 需要处理的字段列表
 * @param extraOpts 额外配置选项
 * @param extraOpts.mainField 主字段名（用于分组，避免跨主列合并）
 * @returns 处理后的数据数组（与输入的data相同）
 * @example
 * // 基础用法
 * const data = [
 *   { category: 'A', value: 1 },
 *   { category: 'A', value: 2 },
 *   { category: 'B', value: 3 }
 * ];
 * setRowSpanForFields(data, ['category']);
 * // 结果：
 * // [
 * //   { category: 'A', value: 1, '_$rowSpan:category': 2 },
 * //   { category: 'A', value: 2, '_$rowSpan:category': 0 },
 * //   { category: 'B', value: 3 }
 * // ]
 *
 * @example
 * // 使用主字段分组（避免跨主列合并）
 * const data = [
 *   { group: 'A', category: 'X', value: 1 },
 *   { group: 'A', category: 'X', value: 2 },
 *   { group: 'B', category: 'X', value: 3 },
 *   { group: 'B', category: 'X', value: 4 }
 * ];
 * setRowSpanForFields(data, ['category'], { mainField: 'group' });
 * // 结果：category 在 group='A' 内合并2行，在 group='B' 内合并2行
 * // 而不是跨越 group 合并4行
 */
export function setRowSpanForFields<T extends AnyObject>(
  data: T[],
  fields: string[],
  extraOpts?: SetRowSpanExtraOpts
): T[] {
  // 快速返回边界情况：空数据直接返回
  if (!data.length) return data

  // 提取主字段配置
  const mainField = extraOpts?.mainField

  /**
   * 为指定字段设置行合并属性
   * @param fieldName 字段名
   * @param startIndex 起始行索引
   * @param spanCount 合并的行数
   */
  function setRowSpan(fieldName: string, startIndex: number, spanCount: number): void {
    // 只有合并行数大于1时才需要设置
    if (spanCount <= 1) return

    // 预先计算属性名
    const spanFieldName = `_$rowSpan:${fieldName}`

    // 设置分组第一行的 rowSpan
    set(data[startIndex], spanFieldName, spanCount)

    // 设置分组中其他行的 rowSpan 为 0（表示被合并）
    for (let rowIndex = startIndex + 1; rowIndex < startIndex + spanCount; rowIndex++) {
      set(data[rowIndex], spanFieldName, 0)
    }
  }

  /**
   * 在指定范围内处理字段的行合并
   * 用于在主字段分组内部处理其他字段，或在无主字段时处理整个数据范围
   * @param rangeStart 范围起始索引
   * @param rangeEnd 范围结束索引（包含）
   * @param targetFields 需要处理的字段列表
   */
  function processFieldsInRange(
    rangeStart: number,
    rangeEnd: number,
    targetFields: string[]
  ): void {
    // 快速返回边界情况：无字段需要处理
    if (!targetFields.length) return

    // 为每个字段创建状态跟踪器
    const fieldTrackers = targetFields.reduce(
      (trackers, field) => {
        trackers[field] = {
          startIndex: rangeStart, // 当前分组的起始索引
          currentValue: undefined, // 当前分组的字段值
          count: 0, // 当前分组的计数
        }
        return trackers
      },
      {} as Record<string, FieldTracker>
    )

    // 在范围内遍历处理每一行
    for (let rowIndex = rangeStart; rowIndex <= rangeEnd; rowIndex++) {
      const currentRow = data[rowIndex]

      // 处理每个字段
      targetFields.forEach((fieldName) => {
        const tracker = fieldTrackers[fieldName]
        const fieldValue = currentRow[fieldName]

        const isLastRowInRange = rowIndex === rangeEnd
        const valueChanged = tracker.currentValue !== fieldValue

        // 如果值缺失，则视为新的分组，并且不参与行合并
        const isValueMissing = fieldValue === undefined || fieldValue === null
        if (isValueMissing) {
          // 先处理之前的分组（如果有）
          if (tracker.count) {
            setRowSpan(fieldName, tracker.startIndex, tracker.count)
          }

          // 重置跟踪器，跳过当前缺失值行
          tracker.startIndex = rowIndex + 1
          tracker.currentValue = undefined
          tracker.count = 0
          return // 跳过当前字段的后续处理
        }

        // 当值发生变化或到达范围最后一行时，处理当前分组
        if (valueChanged || isLastRowInRange) {
          // 只有当存在累积的分组时才处理
          if (tracker.count > 0) {
            // 计算最终的行合并数量
            // 只有当是最后一行且值没有变化时，才将最后一行也计入当前分组
            const spanCount =
              isLastRowInRange && !valueChanged
                ? tracker.count + 1 // 最后一行值相同，包含在当前分组
                : tracker.count // 值变化或最后一行不同，使用当前计数

            // 设置行合并属性
            setRowSpan(fieldName, tracker.startIndex, spanCount)
          }

          // 重置跟踪器，开始新分组
          tracker.startIndex = rowIndex
          tracker.currentValue = fieldValue
          tracker.count = 1
        } else {
          // 值相同，继续累积当前分组
          tracker.count++
        }
      })
    }
  }

  // ===== 无主字段模式 =====
  // 直接处理整个数据范围，不需要分组
  if (!mainField) {
    // 快速返回边界情况：无字段需要处理
    if (!fields.length) return data
    processFieldsInRange(0, data.length - 1, fields)
    return data
  }

  // ===== 有主字段模式 =====
  // 先按主字段划分分组边界，再在每个分组内处理其他字段的行合并
  // 这样可以确保其他字段的合并不会跨越主字段的分组边界

  // 存储主字段分组的边界信息
  const mainGroups: Array<{ startIndex: number; endIndex: number }> = []
  let currentMainValue: unknown // 当前主字段分组的值
  let groupStartIndex = 0 // 当前主字段分组的起始索引
  let mainCount = 0 // 当前主字段分组的计数
  let groupIndex = 0 // 分组序号，用于标记每行属于哪个分组

  /**
   * 保存分组信息并设置分组索引属性
   * 会为分组内的每一行设置 _$rowSpan:<mainField>:groupIndex 属性
   * @param startIndex 分组起始索引
   * @param endIndex 分组结束索引（包含）
   */
  function saveGroup(startIndex: number, endIndex: number): void {
    groupIndex++
    mainGroups.push({ startIndex, endIndex })

    // 为分组内的每一行设置分组索引，便于后续区分不同分组
    for (let rowIdx = startIndex; rowIdx <= endIndex; rowIdx++) {
      set(data[rowIdx], `_$rowSpan:${mainField}:groupIndex`, groupIndex)
    }
  }

  // 遍历数据，找出主字段的分组边界
  for (let i = 0; i < data.length; i++) {
    const mainValue = data[i][mainField]
    const isValueMissing = mainValue === undefined || mainValue === null
    const isLastRow = i === data.length - 1

    // 如果主字段值缺失，则结束当前分组，跳过当前行
    if (isValueMissing) {
      // 先处理之前的分组（如果有）
      if (mainCount > 0) {
        saveGroup(groupStartIndex, groupStartIndex + mainCount - 1)
        setRowSpan(mainField, groupStartIndex, mainCount)
      }

      // 重置跟踪状态，跳过当前缺失值行
      groupStartIndex = i + 1
      currentMainValue = undefined
      mainCount = 0
      continue
    }

    // 当主字段值发生变化时，处理之前的分组并开始新分组
    if (mainCount === 0 || currentMainValue !== mainValue) {
      // 先处理之前的分组（如果有）
      if (mainCount > 0) {
        saveGroup(groupStartIndex, groupStartIndex + mainCount - 1)
        setRowSpan(mainField, groupStartIndex, mainCount)
      }

      // 开始新分组
      groupStartIndex = i
      currentMainValue = mainValue
      mainCount = 1
    } else {
      // 值相同，继续累积当前分组
      mainCount++
    }

    // 处理最后一行：确保最后一个分组也被正确保存
    if (isLastRow && mainCount > 0) {
      saveGroup(groupStartIndex, i)
      setRowSpan(mainField, groupStartIndex, mainCount)
    }
  }

  // 在每个主字段分组内，处理其他字段的行合并
  // 这样确保其他字段的合并不会跨越主字段的分组边界
  for (const group of mainGroups) {
    processFieldsInRange(group.startIndex, group.endIndex, fields)
  }

  return data
}
