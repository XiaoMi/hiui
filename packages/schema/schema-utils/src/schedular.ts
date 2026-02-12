// 粗糙的调度器
// 仅用来收敛内部调用的延迟函数

/**
 * 延迟调度器
 * @desc 执行先后顺序：
 * @desc nextMicro > nextFrame > nextMacro(0) ≈ nextIdle > nextMacro
 */
class SimpleSchedular {
  /**
   * 微任务调度
   * @param task 任务
   */
  static nextMicro(task: AnyFn) {
    Promise.resolve().then(() => task())
  }

  /**
   * 延迟执行任务
   * @param task 任务
   * @param level 延迟等级, 16ms 为一个等级
   */
  static nextMacro(task: AnyFn, level = 0) {
    setTimeout(() => task(), level * 16)
  }

  /** 下一帧执行任务 */
  static nextFrame(task: AnyFn) {
    requestAnimationFrame(() => task())
  }

  /** 空闲时执行任务 */
  static nextIdle(task: AnyFn) {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => task())
    } else {
      this.nextMacro(task, 10)
    }
  }
}

// 执行先后顺序：
// nextMicro > nextFrame > nextMacro(0) ≈ nextIdle > nextMacro

export { SimpleSchedular as Schedular }
