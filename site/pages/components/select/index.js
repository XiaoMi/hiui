import Markdown from '../../../../libs/markdown'

class Select extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/select.md`)
  }
}

export default Select
