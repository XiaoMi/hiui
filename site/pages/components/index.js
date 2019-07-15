const components = {}
const files = require.context(`../../../docs/zh-CN/components`, false, /.mdx$/)
files.keys().forEach(key => {
  let _key = key.split('/')[1].split('.')[0]
  components[_key] = files(key).default
})
export default {
  documents: {
    'quick-start': components['quick-start'],
    template: components['template'],
    theme: components['theme'],
    i18n: components['i18n'],
    changelog: components['changelog']
  },
  components: {
    'group-basic': {
      grid: components['grid'],
      typography: components['typography'],
      button: components['button'],
      icon: components['icon']
    },
    'group-navgation': {
      tabs: components['tabs'],
      dropdown: components['dropdown'],
      pagination: components['pagination'],
      stepper: components['stepper'],
      menu: components['menu']
    },
    'group-form': {
      form: components['form'],
      input: components['input'],
      counter: components['counter'],
      select: components['select'],
      cascader: components['cascader'],
      radio: components['radio'],
      checkbox: components['checkbox'],
      'date-picker': components['date-picker'],
      'time-picker': components['time-picker'],
      upload: components['upload'],
      rate: components['rate']
    },
    'group-data': {
      table: components['table'],
      tree: components['tree'],
      collapse: components['collapse'],
      tooltip: components['tooltip'],
      popover: components['popover'],
      progress: components['progress'],
      card: components['card'],
      timeline: components['timeline'],
      transfer: components['transfer'],
      switch: components['switch']
    },
    'group-tips': {
      modal: components['modal'],
      notification: components['notification'],
      message: components['message'],
      alert: components['alert'],
      tag: components['tag'],
      badge: components['badge'],
      loading: components['loading']
    }
  }
}
