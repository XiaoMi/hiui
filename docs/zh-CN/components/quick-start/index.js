import Markdown from '../../../../libs/markdown'

class QuickStart extends Markdown {
  document(locale) {
    return require(`../quick-start.md`)
  }
}

export default QuickStart
