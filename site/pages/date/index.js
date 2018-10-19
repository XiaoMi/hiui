import Markdown from '../../../libs/markdown'

class Date extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/date.md`)
  }
}

export default Date
