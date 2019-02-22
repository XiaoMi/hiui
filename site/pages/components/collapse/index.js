import Markdown from '../../../../libs/markdown'

class Collapse extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/collapse.md`)
  }
}

export default Collapse
