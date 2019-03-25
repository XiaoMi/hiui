import Markdown from '../../../libs/markdown'
//  概述
class FormDesc extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/form-desc.md`)
  }
}
//  基础表单
class BasicForm extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/form-basic.md`)
  }
}
// 分组型表单
class GroupForm extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/form-group.md`)
  }
}
// 内嵌表格型表单
class InnerTableFrom extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/form-inner.md`)
  }
}
// //  查询表单
// class QueryForm extends Markdown {
//   document (locale) {
//     return require(`../../../docs/${locale}/templates/form-query.md`)
//   }
// }
// 步骤表单
class StepForm extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/templates/form-step.md`)
  }
}

export default {
  'form-desc': FormDesc,
  'form-basic': BasicForm,
  'form-group': GroupForm,
  'form-inner': InnerTableFrom,
  // 'form-query': QueryForm,
  'form-step': StepForm
}
