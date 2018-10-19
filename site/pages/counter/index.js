import Markdown from '../../../libs/markdown'

class Counter extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/counter.md`)
  }
}

export default Counter
