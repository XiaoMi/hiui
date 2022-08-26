/**
 * TODO: What is raf
 */

const target = typeof window === 'undefined' ? global : window
const vendors = ['webkit', 'ms', 'moz', 'o']

let raf: any = ((target as unknown) as Window).requestAnimationFrame
let caf: any = ((target as unknown) as Window).cancelAnimationFrame

if (!raf || !caf) {
  vendors.some((prefix) => {
    // @ts-ignore
    raf = target[`${prefix}RequestAnimationFrame`]
    // @ts-ignore
    caf = target[`${prefix}CancelAnimationFrame`] || target[`${prefix}CancelRequestAnimationFrame`]
    return raf && caf
  })

  if (!raf || !caf) {
    let lastTime = 0
    raf = function (cb: () => void) {
      const currentTime = Date.now()
      const diff = Math.max(0, 16 - (currentTime - lastTime))
      const timer = setTimeout(() => {
        cb()
        lastTime = currentTime + diff
      }, diff)
      return timer
    }

    caf = function (timer: number) {
      clearTimeout(timer)
    }
  }
}

raf = raf.bind(target)
caf = caf.bind(target)

export { raf, caf }
