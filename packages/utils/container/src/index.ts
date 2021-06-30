/**
 * 获取用于承载组件的容器，将挂载在 body 下面
 *
 * @param selector 以 `.` 开头的选择器类
 * @returns 容器元素
 */
export const getContainer = (selector: string) => {
  let rootElm = document.querySelector(selector)

  if (rootElm) return rootElm

  rootElm = document.createElement('div')
  rootElm.className = selector.slice(1)
  document.body.appendChild(rootElm)
  return rootElm
}

/**
 * 从 DOM 中移除指定的承载容器
 *
 * @param selector 以 `.` 开头的选择器类
 */
export const removeContainer = (selector: string) => {
  const rootElm = document.querySelector(selector)

  if (rootElm) {
    rootElm.parentElement?.removeChild(rootElm)
  }
}
