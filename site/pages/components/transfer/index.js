import Markdown from '../../../../libs/markdown'

class Transfer extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/transfer.md`)
  }
}

export default Transfer
