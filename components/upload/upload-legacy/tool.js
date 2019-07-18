const AJAX = function (obj) { // 做网络请求的时候，以对象形式传递进来
  /*
  //规定:obj里面包含属性有：
  1.deleteAction
  2.type---get还是 post
  3.data--前端给后端传递的参数(前端传递的时候以"对象形式")
  4.回调函数---success
  5. hearders---请求头
  */

  let ajaxObj = null
  if (window.XMLHttpRequest) {
    let XMLHttpRequest = window.XMLHttpRequest
    ajaxObj = new XMLHttpRequest()
  } else {
    let ActiveXObject = window.ActiveXObject
    ajaxObj = new ActiveXObject('Microsoft.XMLHTTP')
  }
  // 检测状态的变化
  ajaxObj.onreadystatechange = function () {
    if (ajaxObj.readyState === 4) {
      if ((ajaxObj.status >= 200 && ajaxObj.status < 300) || ajaxObj.status === 304) {
        if (obj.success) {
          obj.success(JSON.parse(ajaxObj.responseText))
        }
      } else {
        // console.log(JSON.parse(ajaxObj))
      }
    }
  }
  // --------------------------------------------
  let params = ''
  // 判断是否传递了参数
  if (obj.data) {
    for (let key in obj.data) {
      params += (key + '=' + obj.data[key] + '&')
    }
    params = params.slice(0, params.length - 1)
  }
  // -------------------------------------------
  // type 转化为小写,方便使用
  let type = obj.type || 'get'
  type = type.toLowerCase()
  if (type === 'get') {
    ajaxObj.open(type, obj.deleteAction + '?' + params, true)
    // 设置用户传入的请求头
    if (obj.headers) {
      for (let j in obj.headers) {
        if (j) {
          ajaxObj.setRequestHeader(j, obj.headers[j])
        }
      }
    }
    ajaxObj.send()
  } else {
    ajaxObj.open(type, obj.deleteAction, true)
    // 设置用户传入的请求头
    if (obj.headers) {
      for (let j in obj.headers) {
        if (j) {
          ajaxObj.setRequestHeader(j, obj.headers[j])
        }
      }
    }
    ajaxObj.send(params)
  }
}

export default AJAX
