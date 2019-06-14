import Markdown from '../../../../libs/markdown'

class Timeline extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/timeline.md`)
  }
}

export default Timeline
