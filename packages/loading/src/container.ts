// 将抽离为 utils
export const getContainer = (selector: string) => {
  let rootElm = document.querySelector(selector)

  if (rootElm) return rootElm

  rootElm = document.createElement("div")
  rootElm.className = selector.slice(1)
  document.body.appendChild(rootElm)
  return rootElm
}

export const removeContainer = (selector: string) => {
  let rootElm = document.querySelector(selector)

  if (rootElm) {
    rootElm.parentElement?.removeChild(rootElm)
  }
}

const Container = {
  get: getContainer,
  remove: removeContainer
}

export default Container
