import { Decimal } from 'decimal.js'

/** 数字参数类型 */
type NumberParam = string | number | undefined

/**
 * 数字计算工具类
 */
export class NumberUtil {
  /**
   * 验证并过滤数字参数
   * @param numbers 需要验证的数字数组
   * @param checkDivisor 是否检查除数为0
   * @returns 验证后的有效数字数组
   */
  static validate(numbers: NumberParam[], checkDivisor = false) {
    return numbers.filter((n) => {
      if (n === null || n === undefined) return false
      const num = Number(n)
      if (Number.isNaN(num) || !Number.isFinite(num)) return false
      if (checkDivisor && num === 0) return false
      return true
    }) as NonNullable<NumberParam>[]
  }

  /**
   * 精确加法(支持多个数相加)
   * @param numbers 加数列表
   * @returns 计算结果数字
   * @example NumberUtil.add(0.1, 0.2, 0.3) => 0.6
   */
  static add(...numbers: NumberParam[]) {
    try {
      const validNumbers = this.validate(numbers)
      if (validNumbers.length === 0) return 0
      return Number(validNumbers.reduce((sum, curr) => sum.plus(new Decimal(curr)), new Decimal(0)))
    } catch (e) {
      console.error('加法计算错误:', e)
      return 0
    }
  }

  /**
   * 精确减法(支持多个数相减)
   * @param minuend 被减数
   * @param subtrahends 减数列表
   * @returns 计算结果数字
   * @example NumberUtil.subtract(1, 0.1, 0.2) => 0.7
   */
  static subtract(minuend: NonNullable<NumberParam>, ...subtrahends: NumberParam[]) {
    try {
      const validMinuend = this.validate([minuend])
      if (validMinuend.length === 0) return 0

      const validNumbers = this.validate(subtrahends)
      if (validNumbers.length === 0) return Number(new Decimal(minuend))

      return Number(
        validNumbers.reduce((result, curr) => result.minus(new Decimal(curr)), new Decimal(minuend))
      )
    } catch (e) {
      console.error('减法计算错误:', e)
      return 0
    }
  }

  /**
   * 精确乘法(支持多个数相乘)
   * @param numbers 乘数列表
   * @returns 计算结果数字
   * @example NumberUtil.multiply(2, 3, 4) => 24
   */
  static multiply(...numbers: NumberParam[]) {
    try {
      const validNumbers = this.validate(numbers)
      // 返回1是因为1是乘法的单位元(任何数乘以1等于它本身)
      // 这与空数组求和返回加法单位元0的逻辑一致
      if (validNumbers.length === 0) return 1
      return Number(
        validNumbers.reduce((product, curr) => product.mul(new Decimal(curr)), new Decimal(1))
      )
    } catch (e) {
      console.error('乘法计算错误:', e)
      return 0
    }
  }

  /**
   * 精确除法(支持多个数相除)
   * @param dividend 被除数
   * @param divisors 除数列表
   * @returns 计算结果数字
   * @example NumberUtil.divide(10, 2, 5) => 1
   */
  static divide(dividend: NonNullable<NumberParam>, ...divisors: NumberParam[]) {
    try {
      const validDividend = this.validate([dividend])
      if (validDividend.length === 0) return 0

      const validNumbers = this.validate(divisors, true)
      if (validNumbers.length === 0) return Number(new Decimal(dividend))

      return Number(
        validNumbers.reduce((result, curr) => result.div(new Decimal(curr)), new Decimal(dividend))
      )
    } catch (e) {
      console.error('除法计算错误:', e)
      return 0
    }
  }

  /**
   * 四舍五入到指定精度
   * @param value 需要处理的数字
   * @param precision 精度位数
   * @example
   * NumberUtil.round(3.456, 2) => 3.46
   * NumberUtil.round(3.454, 2) => 3.45
   */
  static round(value: NumberParam, precision = 0): number {
    try {
      const validValue = this.validate([value])[0]
      if (!validValue) return 0
      return Number(new Decimal(validValue).toFixed(precision))
    } catch (e) {
      console.error('四舍五入计算错误:', e)
      return 0
    }
  }

  /**
   * 向上取整到指定精度
   * @param value 需要处理的数字
   * @param precision 精度位数
   * @example
   * NumberUtil.ceil(3.456, 2) => 3.46
   * NumberUtil.ceil(3.454, 2) => 3.46
   */
  static ceil(value: NumberParam, precision = 0): number {
    try {
      const validValue = this.validate([value])[0]
      if (!validValue) return 0
      const factor = new Decimal(10).pow(precision)
      return Number(new Decimal(validValue).mul(factor).ceil().div(factor))
    } catch (e) {
      console.error('向上取整计算错误:', e)
      return 0
    }
  }

  /**
   * 向下取整到指定精度
   * @param value 需要处理的数字
   * @param precision 精度位数
   * @example
   * NumberUtil.floor(3.456, 2) => 3.45
   * NumberUtil.floor(3.454, 2) => 3.45
   */
  static floor(value: NumberParam, precision = 0): number {
    try {
      const validValue = this.validate([value])[0]
      if (!validValue) return 0
      const factor = new Decimal(10).pow(precision)
      return Number(new Decimal(validValue).mul(factor).floor().div(factor))
    } catch (e) {
      console.error('向下取整计算错误:', e)
      return 0
    }
  }

  /**
   * 数字千分符格式化
   * @param value 需要格式化的数字
   * @param precision 保留小数位数
   * @returns 格式化后的字符串，只对整数部分添加千分符，小数部分保持不变
   * @example
   * NumberUtil.format(12345.67) => "12,345.67"
   * NumberUtil.format(12345.67, 1) => "12,345.7"
   * NumberUtil.format(1234567.891234, 4) => "1,234,567.8912"
   * NumberUtil.format(1234567890.123) => "1,234,567,890.123"
   */
  static format(value: NumberParam, precision?: number): string {
    try {
      const validValue = this.validate([value])[0]
      if (!validValue) return '0'

      return this.round(validValue, precision).toLocaleString()
    } catch (e) {
      console.error('格式化错误:', e)
      return '0'
    }
  }

  /**
   * 创建链式调用实例
   * @param initialValue 初始值
   * @example
   * // 基础运算
   * NumberUtil.chain(10)
   *   .add(5)      // 15
   *   .multiply(2) // 30
   *   .subtract(3) // 27
   *   .divide(4)   // 6.75
   *   .round(1)    // 6.8
   *   .value()
   *
   * // 多个数字运算
   * NumberUtil.chain(100)
   *   .add(20, 30, 50)     // 200
   *   .multiply(1.1, 1.2)  // 264
   *   .round(2)            // 264.00
   *   .value()
   *
   * // 金额计算(保留2位小数)
   * NumberUtil.chain(100.56789)
   *   .multiply(0.8)   // 80.454312
   *   .round(2)        // 80.45
   *   .add(9.99)       // 90.44
   *   .format()        // "90.44"
   *
   * // 不同取整方式
   * NumberUtil.chain(3.456)
   *   .round(2)    // 3.46 四舍五入
   *   .ceil(1)     // 3.5  向上取整
   *   .floor(0)    // 3    向下取整
   *   .value()
   *
   * // 千分符格式化
   * NumberUtil.chain(1234567.89)
   *   .multiply(2)          // 2469135.78
   *   .round(2)            // 2469135.78
   *   .format()            // "2,469,135.78"
   *
   * NumberUtil.chain(1234567.891234, 4)
   *   .format()            // "1,234,567.8912"
   */
  static chain(initialValue?: NumberParam): NumberChain {
    // 循环依赖了，暂时忽略
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new NumberChain(initialValue)
  }
}

/**
 * 数字计算链式调用类
 */
export class NumberChain {
  private currentValue: number

  constructor(initialValue: NumberParam = 0) {
    this.currentValue = Number(NumberUtil.validate([initialValue])[0] || 0)
  }

  /**
   * 加法运算
   * @param numbers 加数列表
   */
  add(...numbers: NumberParam[]): NumberChain {
    this.currentValue = NumberUtil.add(this.currentValue, ...numbers)
    return this
  }

  /**
   * 减法运算
   * @param numbers 减数列表
   */
  subtract(...numbers: NumberParam[]): NumberChain {
    this.currentValue = NumberUtil.subtract(this.currentValue, ...numbers)
    return this
  }

  /**
   * 乘法运算
   * @param numbers 乘数列表
   */
  multiply(...numbers: NumberParam[]): NumberChain {
    this.currentValue = NumberUtil.multiply(this.currentValue, ...numbers)
    return this
  }

  /**
   * 除法运算
   * @param numbers 除数列表
   */
  divide(...numbers: NumberParam[]): NumberChain {
    this.currentValue = NumberUtil.divide(this.currentValue, ...numbers)
    return this
  }

  /**
   * 设置精度
   * @param precision 精度位数
   */
  round(precision?: number): NumberChain {
    this.currentValue = NumberUtil.round(this.currentValue, precision)
    return this
  }

  /**
   * 获取计算结果
   */
  value(): number {
    return this.currentValue
  }

  /**
   * 转换为千分符格式
   * @param precision 保留小数位数
   * @returns 格式化后的字符串
   * @example
   * NumberUtil.chain(12345.67)
   *   .multiply(2)    // 24691.34
   *   .round(1)       // 24691.3
   *   .format()       // "24,691.3"
   */
  format(precision?: number): string {
    return NumberUtil.format(this.currentValue, precision)
  }
}
