module.exports = {
  misc: {
    components: '基础组件'
  },
  datePicker: {
    ok: '确认',
    to: '至',
    placeholder: '请选择日期',
    dateChoose: '日期选择',
    timeChoose: '时间选择',
    undefinedType: '类型未定义',
    lastWeek: '近一周',
    lastMonth: '近一月',
    lastThreeMonth: '近三月',
    lastYear: '近一年',
    month: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
    week: [ '日', '一', '二', '三', '四', '五', '六' ],
    placeholders: {
      date: '请选择日期',
      month: '请选择月',
      year: '请选择年',
      time: '请选择时间',
      daterange: '请选择日期',
      week: '请选择周',
      weekrange: '请选择周'
    },
    weekrange: function (year, week) {
      return year + '-W' + week
    }
  },
  pagination: {
    total: function (total) {
      return '共 ' + total + ' 条'
    },
    item: '条',
    itemPerPage: '每页',
    goto: '前往'
  },
  cascader: {
    placeholder: '请选择',
    noFoundTip: '无匹配数据'
  },
  select: {
    placeholder: '请选择',
    noFoundTip: '无匹配数据'
  },
  upload: {
    buttonText: '上传'
  },
  modal: {
    confirmText: '确定',
    cancelText: '取消'
  }
}
