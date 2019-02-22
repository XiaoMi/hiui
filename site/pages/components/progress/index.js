import Markdown from '../../../../libs/markdown'
class progress extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/progress.md`)
  }
}

export default progress
