import Markdown from '../../../../libs/markdown'

class Panel extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/panel.md`)
  }
}

export default Panel
