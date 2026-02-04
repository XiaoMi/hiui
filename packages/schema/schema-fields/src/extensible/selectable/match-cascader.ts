export type MatchedCascaderOptsType = {
  id: string | number
  title: string
}

/**
 * 在嵌套选项数据中匹配多个路径
 * @param values 二维数组，包含多个级联路径，例如 [['hubei', 'wuhan'], ['guangdong', 'shenzhen']]
 * @param options 嵌套选项数据，包含 children 的树形结构
 * @param extra 配置选项
 * @returns 二维数组，保持输入的结构，每个路径对应一个匹配的选项链数组
 *
 * 边界条件处理：
 * - 部分匹配：如果路径中某一层找不到，返回已匹配的部分（而不是空数组）
 * - 缺失title：如果选项的title字段不存在，自动使用id字段作为默认值
 * - 完全不匹配：如果第一层就找不到，返回空数组
 */
export function matchCascaderOpts(
  values: (string | number)[][],
  options: AnyArray,
  extra: {
    fieldNames?: Record<string, string>
  } = {}
): MatchedCascaderOptsType[][] {
  const { fieldNames = {} } = extra
  const { id: idFieldKey = 'id', title: titleFieldKey = 'title' } = fieldNames

  /**
   * 根据单个路径查找对应的选项链
   * @param path 单个路径数组，例如 ['hubei', 'wuhan']
   * @param opts 当前层级的选项数据
   * @returns 匹配的选项数组
   */
  function findPathOptions(path: (string | number)[], opts: AnyArray): AnyObject[] {
    const result: AnyObject[] = []
    let currentOptions = opts

    for (const valueId of path) {
      const found = currentOptions.find((item) => String(item[idFieldKey]) === String(valueId))
      if (found) {
        result.push(found)
        // 如果还有下一层，继续在 children 中查找
        currentOptions = found.children || []
      } else {
        // 如果某一层找不到对应的选项，就停止查找
        break
      }
    }

    // 返回部分匹配的结果，即使路径不完整也返回已匹配的部分
    return result
  }

  try {
    // 转换函数：将原始选项转换为 MatchedNestOptsType 格式
    // const convertToMatchedType =

    // 处理每个路径，保持二维数组结构
    return values.map((path) => {
      if (!Array.isArray(path)) return []

      const pathOptions = findPathOptions(path, options)
      return pathOptions.map((option) => {
        const id = option[idFieldKey]
        const title = option[titleFieldKey] || String(id) // 如果 title 不存在，使用 id 作为默认值

        return {
          id,
          title,
        } satisfies MatchedCascaderOptsType
      })
    })
  } catch (error) {
    console.error('matchCascaderOpts', error)
    return []
  }
}

// 测试用例示例（可取消注释运行）
/*
const testOpts = [
  {
    id: 'hubei',
    title: '湖北',
    children: [
      { id: 'wuhan', title: '武汉' },
      { id: 'xiangyang', title: '襄阳' },
      { id: 'noTitle' }, // 测试没有 title 的情况
    ],
  },
  {
    id: 'beijing',
    title: '北京',
    children: [
      { id: 'haidian', title: '海淀' },
      { id: 'chaoyang', title: '朝阳' },
    ],
  },
  {
    id: 'guangdong',
    // 测试第一层没有 title 的情况
    children: [{ id: 'shenzhen', title: '深圳' }],
  },
]

// 边界条件测试用例
console.log('=== 正常匹配 ===')
console.log(matchCascaderOpts([['hubei', 'wuhan']], testOpts))
// 预期输出: [[{ id: 'hubei', title: '湖北' }, { id: 'wuhan', title: '武汉' }]]

console.log('\n=== 第一层查到，第二层没查到（部分匹配） ===')
console.log(matchCascaderOpts([['hubei', 'nonexistent']], testOpts))
// 预期输出: [[{ id: 'hubei', title: '湖北' }]]

console.log('\n=== ID查到了，title没查到（使用ID作为默认值） ===')
console.log(matchCascaderOpts([['hubei', 'noTitle']], testOpts))
// 预期输出: [[{ id: 'hubei', title: '湖北' }, { id: 'noTitle', title: 'noTitle' }]]

console.log('\n=== 第一层没有title（使用ID作为默认值） ===')
console.log(matchCascaderOpts([['guangdong', 'shenzhen']], testOpts))
// 预期输出: [[{ id: 'guangdong', title: 'guangdong' }, { id: 'shenzhen', title: '深圳' }]]

console.log('\n=== 完全匹配不到 ===')
console.log(matchCascaderOpts([['nonexistent', 'city']], testOpts))
// 预期输出: [[]]

console.log('\n=== 多路径混合测试 ===')
console.log(
  matchCascaderOpts(
    [
      ['hubei', 'wuhan'], // 正常匹配
      ['hubei', 'nonexistent'], // 部分匹配
      ['guangdong', 'shenzhen'], // 第一层无title
      ['nonexistent'], // 完全不匹配
    ],
    testOpts
  )
)
*/
