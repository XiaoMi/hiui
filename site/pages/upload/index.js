import Markdown from '../../../libs/markdown'

class Upload extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/upload.md`)
  }
}

export default Upload
