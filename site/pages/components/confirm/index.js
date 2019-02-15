import Markdown from '../../../../libs/markdown'

class Date extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/confirm.md`)
  }
}

export default Date
