import Markdown from '../../../../libs/markdown'

class Date extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/date.md`)
  }
}

export default Date
