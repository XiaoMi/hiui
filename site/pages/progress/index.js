import Markdown from '../../../libs/markdown'

class progress extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/progress.md`)
  }
}

export default progress
