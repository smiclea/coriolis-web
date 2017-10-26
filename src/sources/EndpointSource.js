import cookie from 'js-cookie'
import moment from 'moment'

import Api from '../utils/ApiCaller'

import { servicesUrl } from '../config'

class EdnpointSource {
  static getEndpoints() {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      if (projectId) {
        Api.sendAjaxRequest({
          url: `${servicesUrl.coriolis}/${projectId}/endpoints`,
          method: 'GET',
        }).then(response => {
          let connections = []
          if (response.data.endpoints.length) {
            response.data.endpoints.forEach(endpoint => {
              connections.push(endpoint)
            })
          }

          connections.sort((c1, c2) => moment(c2.created_at).diff(moment(c1.created_at)))

          resolve(connections)
        }, reject).catch(reject)
      } else {
        reject()
      }
    })
  }
  static delete(endpoint) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/endpoints/${endpoint.id}`,
        method: 'DELETE',
      }).then(() => {
        if (endpoint.connection_info && endpoint.connection_info.secret_ref) {
          let uuidIndex = endpoint.connection_info.secret_ref.lastIndexOf('/')
          let uuid = endpoint.connection_info.secret_ref.substr(uuidIndex + 1)
          Api.sendAjaxRequest({
            url: `${servicesUrl.barbican}/v1/secrets/${uuid}`,
            method: 'DELETE',
          }).then(() => { resolve(endpoint.id) }, reject).catch(reject)
        } else {
          resolve(endpoint.id)
        }
      }, reject).catch(reject)
    })
  }

  static getConnectionInfo(endpoint) {
    let index = endpoint.connection_info.secret_ref.lastIndexOf('/')
    let uuid = endpoint.connection_info.secret_ref.substr(index + 1)

    return new Promise((resolve, reject) => {
      Api.sendAjaxRequest({
        url: `${servicesUrl.barbican}/v1/secrets/${uuid}/payload`,
        method: 'GET',
        json: false,
        headers: { Accept: 'text/plain' },
      }).then((response) => {
        resolve(JSON.parse(response.data))
      }, reject).catch(reject)
    })
  }
}

export default EdnpointSource
