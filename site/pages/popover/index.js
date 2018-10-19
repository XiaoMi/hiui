import Markdown from '../../../libs/markdown'

class Popover extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/popover.md`)
  }
}

export default Popover
