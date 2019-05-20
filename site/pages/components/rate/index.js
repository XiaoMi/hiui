import Markdown from '../../../../libs/markdown'

class Rate extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/rate.md`)
  }
}

export default Rate
