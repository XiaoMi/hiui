import Markdown from '../../../libs/markdown'

class Select extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/select.md`)
  }
}

export default Select
