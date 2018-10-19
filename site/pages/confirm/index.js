import Markdown from '../../../libs/markdown'

class Date extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/confirm.md`)
  }
}

export default Date
