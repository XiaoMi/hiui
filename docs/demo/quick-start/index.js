import Markdown from '../../../libs/markdown'

class QuickStart extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/components/quick-start.md`)
  }
}

export default QuickStart
