import Markdown from '../../../../libs/markdown'

class DatePicker extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/date-picker.md`)
  }
}

export default DatePicker
