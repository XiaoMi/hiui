// import {Toast} from 'antd-mobile';

const $$ = {}
/**
 * 全局变量（储存在全局上的数据）管理getter&setter
 * @type {{getItem: $$.storage.getItem,setItem: $$.storage.setItem,removeItem: $$.storage.removeItem}}
 */
const storage = {}
$$.storage = {
  getItem: function (key) {
    return storage[key]
  },
  setItem: function (key, obj) {
    storage[key] = obj
    return obj
  },
  removeItem: function (key) {
    return delete storage[key]
  }
}
Object.freeze($$.storage)

// /**
//  * 对象扩展（浅拷贝）
//  * @returns {*}
//  */

$$.extend = (...obj) => {
  if (typeof Object.assign === 'function') {
    return Object.assign(...obj)
  } else {
    const target = Object(obj[0])
    for (let index = 1; index < obj.length; index++) {
      const source = obj[index]
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }
    }
    return target
  }
}

$$.ajax = function () {
  var ajaxData = {
    type: arguments[0].type || 'GET',
    url: arguments[0].url || '',
    async: arguments[0].async || 'true',
    data: arguments[0].data || null,
    dataType: arguments[0].dataType || 'text',
    contentType: arguments[0].contentType || '',
    beforeSend: arguments[0].beforeSend || function () {},
    success: arguments[0].success || function () {},
    error: arguments[0].error || function () {}
  }

  ajaxData.beforeSend()
  var xhr = createxmlHttpRequest()
  var data = convertData(ajaxData.data)
  var url = ajaxData.type.toLocaleUpperCase() === 'GET' ? ajaxData.url + '?' + data : ajaxData.url

  xhr.responseType = ajaxData.dataType
  xhr.open(ajaxData.type, url, ajaxData.async)
  ajaxData.contentType && xhr.setRequestHeader('Content-Type', ajaxData.contentType)
  xhr.send(data)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        ajaxData.success(xhr.response)
      } else {
        ajaxData.error()
      }
    }
  }
}
function createxmlHttpRequest () {
  if (window.ActiveXObject) {
    return new window.ActiveXObject('Microsoft.XMLHTTP')
  } else if (window.XMLHttpRequest) {
    return new window.XMLHttpRequest()
  }
}

function convertData (data) {
  if (typeof data === 'object') {
    var convertResult = ''
    for (var c in data) {
      convertResult += c + '=' + data[c] + '&'
    }
    convertResult = convertResult.substring(0, convertResult.length - 1)
    return convertResult
  } else {
    return data
  }
}
export default $$
