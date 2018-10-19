import Markdown from '../../../libs/markdown'

class Loading extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/loading.md`)
  }
}

export default Loading
