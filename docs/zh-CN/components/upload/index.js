import Markdown from '../../../../libs/markdown'

class Upload extends Markdown {
  document(locale) {
    return require(`../upload.md`)
  }
}

export default Upload
