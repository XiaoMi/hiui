import Markdown from '../../../libs/markdown'

class Input extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/input.md`)
  }
}

export default Input
