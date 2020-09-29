# HiRequest 【hi-got】

为了方便以及统一大家对于数据请求的方式，HiUI特封装请求工具HiRequest

### 快速使用
```javascript
import HiRequest from '@hi-ui/hiui/es/hi-request'

```

### Get 请求

```javascript
// 简单的 Get 请求示例
// Make a request for a user with a given ID
HiRequest.get('/user?ID=12345')
  .then(function(response) {
    // handle success
    console.log(response)
  })
  .catch(function(error) {
    // handle error
    console.log(error)
  })
  .then(function() {
    // always executed
  })

// 上面的请求也可以这样做
HiRequest.get('/user', {
  params: {
    ID: 12345
  }
})
  .then(function(response) {
    console.log(response)
  })
  .catch(function(error) {
    console.log(error)
  })
  .then(function() {
    // always executed
  })

// 想要使用 async/await ? 将' async '关键字添加到外部函数/方法中。
async function getUser() {
  try {
    const response = await HiRequest.get('/user?ID=12345')
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}
```

### POST 请求

```javascript
HiRequest.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone'
})
  .then(function(response) {
    console.log(response)
  })
  .catch(function(error) {
    console.log(error)
  })
```
### 执行多个并发请求

```js
function getUserAccount() {
  return HiRequest.get('/user/12345')
}

function getUserPermissions() {
  return HiRequest.get('/user/12345/permissions')
}

HiRequest.all([getUserAccount(), getUserPermissions()]).then(
  HiRequest.spread(function(acct, perms) {
    // Both requests are now complete
  })
)
```


### Upload 请求方法

```js
HiRequest.upload(({
  url: 'https://upload', // 上传地址
  name: 'filename', // 文件参数
  file: '', // 文件
  params: {
    id:1
  }, // 其他参数
  withCredentials:true,
  headers: {
    token:'token'
  },
  onUploadProgress: (event) => {
    // 上传进度
  }
}).then((res) => {
  if (res.status === 200) {
    // 返回结果
  } else {
    onerror(res.response)
  }
}).catch(error => {
  onerror(error.response)
});
```
### Download 下载方法


```js
HiRequest.download({
  url: 'https://download', // 上传地址
  filename: '下载文件名', // 文件
  params: {
    id: 1
  }, // 其他参数
  withCredentials: true,
  headers: {
    token: 'token'
  },
  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: progressEvent => {
    // 对原生进度事件的处理
  },
  downloadSuccess: res => {
    // 下载成功
  },
  downloadFail: res => {
    // 下载失败
  }
})
```

### JSONP 请求

```js
HiRequest.jsonp('/users.jsonp')
  .then(function(response) {
    return response.json()
  })
  .then(function(json) {
    console.log('parsed json', json)
  })
  .catch(function(ex) {
    console.log('parsing failed', ex)
  })
```
#### 设置 JSONP 回调参数名称，默认为'callback'

```js
HiRequest.jsonp('/users.jsonp', {
  jsonpCallback: 'custom_callback'
})
  .then(function(response) {
    return response.json()
  })
  .then(function(json) {
    console.log('parsed json', json)
  })
  .catch(function(ex) {
    console.log('parsing failed', ex)
  })
```

#### 设置 JSONP 回调函数名称，默认为带 json\_前缀的随机数

```javascript
HiRequest.jsonp('/users.jsonp', {
  jsonpCallbackFunction: 'function_name_of_jsonp_response'
})
  .then(function(response) {
    return response.json()
  })
  .then(function(json) {
    console.log('parsed json', json)
  })
  .catch(function(ex) {
    console.log('parsing failed', ex)
  })
```

#### 设置 JSONP 请求超时，默认为 5000ms

```javascript
HiRequest.jsonp('/users.jsonp', {
  timeout: 3000
})
  .then(function(response) {
    return response.json()
  })
  .then(function(json) {
    console.log('parsed json', json)
  })
  .catch(function(ex) {
    console.log('parsing failed', ex)
  })
```

#### `jsonpCallback`和之间的区别`jsonCallbackFunction`

这两个功能可以很容易地相互混淆，但是有一个明显的区别。

默认值为

- `jsonpCallback`，默认值为`callback`。这是回调参数的名称
- `jsonCallbackFunction`，默认值为`null`。这是回调函数的名称。为了使其与众不同，它是一个`jsonp_`前缀为的随机字符串`jsonp_1497658186785_39551`。如果由服务器设置，则将其保留为空白；如果回调函数名称是固定的，则将其显式设置。

##### Case 1:

```js
HiRequest.jsonp('/users.jsonp', {
  jsonpCallback: 'cb'
})
```

请求网址将为`/users.jsonp?cb=jsonp_1497658186785_39551`，并且服务器应使用以下函数进行响应：

```js
jsonp_1497658186785_39551(
  { ...data here... }
)
```

##### Case 2:

```js
HiRequest.jsonp('/users.jsonp', {
  jsonpCallbackFunction: 'search_results'
})
```

请求网址将为`/users.jsonp?callback=search_results`，并且服务器应始终使用名为的函数进行响应`search_results`

```js
search_results(
  { ...data here... }
)
```


## HiRequest API

##### HiRequest(config)

```js
// 一个简单的post请求
HiRequest({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
})
```

```js
// 获取远程图片
HiRequest({
  method: 'get',
  url: 'http://bit.ly/2mTM3nY',
  responseType: 'stream'
}).then(function(response) {
  response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
})
```

##### HiRequest(url[, config])

```js
// Send a GET request (default method)
HiRequest('/user/12345')
```

### 为了方便起见，为所有支持的请求方法提供了别名。

##### HiRequest(config)

##### HiRequest.get(url[, config])

##### HiRequest.delete(url[, config])

##### HiRequest.head(url[, config])

##### HiRequest.options(url[, config])

##### HiRequest.post(url[, data[, config]])

##### HiRequest.put(url[, data[, config]])

##### HiRequest.patch(url[, data[, config]])

##### HiRequest.getCookiesParam(url[, data[, config]])

##### HiRequest.upload(url[, data[, config]])

##### HiRequest.jsonp(url[, data[, config]])

## Request Config

```js
//获取cookies中的指定项
HiRequest.getCookiesParam(key)
```

```js
{
  // `url` 上传地址必填项
  url: '/user',

  // `method` is the request method to be used when making the request
  method: 'get', // default
  // 添加上传文件方式

  type: 'basics', // 如果是上传就使用upload
  // 当type: 'upload'的时候；需要指定下面的参数
    file?: any, // 需要上传的文件
    name?: string, // 文件参数名称
  // 发送接口时request拦截器
  beforeRequest: [function (config){
      // 对config进行自定义处理
      return config
  }],
  // 获取结果时；返回页面层面数据时候 拦截器
  beforeResponse: [function (res){
      // 对返回结果进行自定义处理
      return res
  }],
  // 返回数据异常结果
  errorResponse: [function (error){
      // 对error进行自定义处理
      console.log(error.response)
  }],
  // 请求异常结果
  errorRequest: [function (error){
      // 对config进行自定义处理
      console.log(error.request)
  }],
  // 异常结果 返回或者其他异常都会走这个
  errorCallback: [function (error){
      // 对config进行自定义处理
      console.log(err,error.request || error.response)
  }],
  // 如果url不是绝对地址，' baseURL '将被加在' url '前面。
  // 为HiRequest的一个实例设置' baseURL '可以方便地将相对url传递给该实例的方法。
  baseURL: 'https://some-domain.com/api/',
  // 允许在请求数据被发送到服务器之前对其进行更改
  // 只适用于请求方法 'PUT'， 'POST'， 'PATCH'和'DELETE'
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data

    return data;
  }],

  // 允许之前对响应数据进行更改
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // 自定义headers
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 与请求一起发送的URL参数
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  data: {
    firstName: 'Fred'
  },

  // syntax alternative to send data into the body
  // method post
  // only the value is sent, not the key
  data: 'Country=Brasil&City=Belo Horizonte',

  // `timeout` 超时
  // 超时后，请求将被禁止
  timeout: 1000, // default is `0` (no timeout)


  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default

  // `adapter` allows custom handling of requests which makes testing easier.
  // Return a promise and supply a valid response (see lib/adapters/README.md).
  adapter: function (config) {
    /* ... */
  },

  // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an `Authorization` header, overwriting any existing
  // `Authorization` custom headers you have set using `headers`.
  // Please note that only HTTP Basic auth is configurable through this parameter.
  // For Bearer tokens and such, use `Authorization` custom headers instead.
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

    // 使用HiRequest.download的时候；下载的时候；需要指定 filename;下载后的文件名称；
    filename: '未命名',// browser only
  // `responseType` indicates the type of data that the server will respond with
  // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  //   browser only: 'blob'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default

  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

  // `onUploadProgress` allows handling of progress events for uploads
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `maxContentLength` defines the max size of the http response content in bytes allowed
  maxContentLength: 2000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, no redirects will be followed.
  maxRedirects: 5, // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null, // default

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // `keepAlive` that are not enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' defines the hostname and port of the proxy server.
  // You can also define your proxy using the conventional `http_proxy` and
  // `https_proxy` environment variables. If you are using environment variables
  // for your proxy configuration, you can also define a `no_proxy` environment
  // variable as a comma-separated list of domains that should not be proxied.
  // Use `false` to disable proxies, ignoring environment variables.
  // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
  // supplies credentials.
  // This will set an `Proxy-Authorization` header, overwriting any existing
  // `Proxy-Authorization` custom headers you have set using `headers`.
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` specifies a cancel token that can be used to cancel the request
  // (see Cancellation section below for details)
  cancelToken: new CancelToken(function (cancel) {
  })
}
```

## Response Schema

The response for a request contains the following information.

```js
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers: {},

  // `config` is the config that was provided to `HiRequest` for the request
  config: {},

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance in the browser
  request: {}
}
```

When using `then`, you will receive the response as follows:

```js
HiRequest.get('/user/12345').then(function(response) {
  console.log(response.data)
  console.log(response.status)
  console.log(response.statusText)
  console.log(response.headers)
  console.log(response.config)
})
```

## Handling Errors

```js
HiRequest.get('/user/12345').catch(function(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data)
    console.log(error.response.status)
    console.log(error.response.headers)
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message)
  }
  console.log(error.config)
})
```

Using the `validateStatus` config option, you can define HTTP code(s) that should throw an error.

```js
HiRequest.get('/user/12345', {
  validateStatus: function(status) {
    return status < 500 // Reject only if the status code is greater than or equal to 500
  }
})
```

Using `toJSON` you get an object with more information about the HTTP error.

```js
HiRequest.get('/user/12345').catch(function(error) {
  console.log(error.toJSON())
})
```

## Cancellation

You can cancel a request using a _cancel token_.

> The HiRequest cancel token API is based on the withdrawn [cancelable promises proposal](https://github.com/tc39/proposal-cancelable-promises).

You can create a cancel token using the `CancelToken.source` factory as shown below:

```js
const CancelToken = HiRequest.CancelToken
const source = CancelToken.source()

HiRequest.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (HiRequest.isCancel(thrown)) {
    console.log('Request canceled', thrown.message)
  } else {
    // handle error
  }
})

HiRequest.post(
  '/user/12345',
  {
    name: 'new name'
  },
  {
    cancelToken: source.token
  }
)

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.')
```

You can also create a cancel token by passing an executor function to the `CancelToken` constructor:

```js
const CancelToken = HiRequest.CancelToken
let cancel

HiRequest.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c
  })
})

// cancel the request
cancel()
```

> Note that `URLSearchParams` is not supported by all browsers (see [caniuse.com](http://www.caniuse.com/#feat=urlsearchparams)), but there is a [polyfill](https://github.com/WebReflection/url-search-params) available (make sure to polyfill the global environment).

Alternatively, you can encode data using the [`qs`](https://github.com/ljharb/qs) library:

```js
const qs = require('qs')
HiRequest.post('/foo', qs.stringify({ bar: 123 }))
```

Or in another way (ES6),

```js
import qs from 'qs'
const data = { bar: 123 }
const options = {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  data: qs.stringify(data),
  url
}
HiRequest(options)
```

### Node.js

In node.js, you can use the [`querystring`](https://nodejs.org/api/querystring.html) module as follows:

```js
const querystring = require('querystring')
HiRequest.post('http://something.com/', querystring.stringify({ foo: 'bar' }))
```
