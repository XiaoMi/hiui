import Markdown from '../../../../libs/markdown'

class Checkbox extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/checkbox.md`)
  }
}

export default Checkbox
