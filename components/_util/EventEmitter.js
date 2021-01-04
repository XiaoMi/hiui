class EventEmitter {
  constructor() {
    this.event = {}
  }

  // 监听
  on(type, listener) {
    this.event[type] = listener
  }

  // 触发事件
  emit(type, ...arg) {
    this.event[type] && this.event[type](...arg)
  }

  removeListener(type) {
    if (this.event[type]) {
      delete this.event[type]
    }
  }

  removeAll(type) {
    this.event = {}
  }
}
export default new EventEmitter()
