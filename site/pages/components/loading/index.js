import Markdown from '../../../../libs/markdown'

class Loading extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/loading.md`)
  }
}

export default Loading
