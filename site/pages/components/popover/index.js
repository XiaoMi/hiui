import Markdown from '../../../../libs/markdown'

class Popover extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/popover.md`)
  }
}

export default Popover
