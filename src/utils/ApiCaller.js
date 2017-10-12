import NotificationActions from '../actions/NotificationActions'

let apiInstance = null

class ApiCaller {
  defaultHeaders = {
    'Content-Type': 'application/json',
  }

  constructor() {
    if (!apiInstance) {
      apiInstance = this
    }

    return apiInstance
  }

  sendAjaxRequest(options) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest()
      request.open(options.method, options.url)

      let headers = Object.assign({}, this.defaultHeaders)

      if (options.headers) {
        Object.keys(options.headers).forEach((key) => {
          headers[key] = options.headers[key]
        })
      }

      Object.keys(headers).forEach((name) => {
        request.setRequestHeader(name, headers[name])
      })

      request.onreadystatechange = () => {
        if (request.readyState === 4) { // if complete
          if (!(request.status >= 200 && request.status <= 299)) { // check if "OK" (200)
            reject({ status: request.status })
          }
        }
      }

      console.log(`Sending ${options.method} Request to ${options.url}`) // eslint-disable-line no-console

      try {
        options.data ? request.send(JSON.stringify(options.data)) : request.send()
      } catch (err) {
        reject(err)
      }

      request.onload = () => {
        let data = options.json !== false ? JSON.parse(request.responseText) : request.responseText
        let result = {
          status: request.status,
          data: (request.responseText && data) || null,
          headers: ApiCaller.processHeaders(request.getAllResponseHeaders()),
        }
        if (result.status >= 200 && result.status <= 299) {
          console.log(`Response ${options.url}`, result.data) // eslint-disable-line no-console
          resolve(result)
        } else {
          console.log(`Error Response: ${options.url}`, result.data) // eslint-disable-line no-console

          if (result.data && result.data.error && result.data.error.message &&
            (result.status !== 401 || window.location.hash !== '#/')) {
            NotificationActions.notify(result.data.error.message, 'error')
          }

          if (result.status === 401 && window.location.hash !== '#/') {
            this.resetHeaders()
            window.location.href = '/#/'
          }
          reject({ status: request.status })
        }
      }

      request.onerror = (result) => {
        NotificationActions.notify('Request failed, there might be a problem with the connection to the server.', 'error')

        console.log('Error Response: ', result.data) // eslint-disable-line no-console
        reject({ status: 500, data: 'Connection error' })
      }
    })
  }

  resetHeaders() {
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  static processHeaders(rawHeaders) {
    let headers = {}
    let lines = rawHeaders.split('\n')
    lines.forEach((line) => {
      let comps = line.split(':')
      if (comps[0].length) {
        headers[comps[0]] = comps[1].trim()
      }
    })
    return headers
  }

  setDefaultHeader(name, value) {
    if (value == null) {
      delete this.defaultHeaders[name]
    } else {
      this.defaultHeaders[name] = value
    }
  }
}

export default new ApiCaller()
