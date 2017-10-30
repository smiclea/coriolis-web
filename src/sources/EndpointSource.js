import cookie from 'js-cookie'
import moment from 'moment'

import Api from '../utils/ApiCaller'
import { SchemaParser } from './Schemas'

import { servicesUrl } from '../config'

let getBarbicanPayload = data => {
  return {
    payload: JSON.stringify(data),
    payload_content_type: 'text/plain',
    algorithm: 'aes',
    bit_length: 256,
    mode: 'cbc',
    content_types: {
      default: 'text/plain',
    },
  }
}

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

  static validate(endpoint) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/endpoints/${endpoint.id}/actions`,
        method: 'POST',
        data: { 'validate-connection': null },
      }).then(response => {
        resolve(response.data['validate-connection'])
      }, reject).catch(reject)
    })
  }

  static update(endpoint) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      let payload = SchemaParser.fieldsToPayload(endpoint)

      if (endpoint.connection_info && endpoint.connection_info.secret_ref) {
        let uuidIndex = endpoint.connection_info.secret_ref.lastIndexOf('/')
        let uuid = endpoint.connection_info.secret_ref.substr(uuidIndex + 1)

        Api.sendAjaxRequest({
          url: `${servicesUrl.barbican}/v1/secrets/${uuid}`,
          method: 'DELETE',
        })

        Api.sendAjaxRequest({
          url: `${servicesUrl.barbican}/v1/secrets`,
          method: 'POST',
          data: getBarbicanPayload(payload.connection_info),
        }).then(response => {
          let connectionInfo = { secret_ref: response.data.secret_ref }
          let newPayload = {
            endpoint: {
              name: payload.name,
              description: payload.description,
              connection_info: connectionInfo,
            },
          }
          Api.sendAjaxRequest({
            url: `${servicesUrl.coriolis}/${projectId}/endpoints/${endpoint.id}`,
            method: 'PUT',
            data: newPayload,
          }).then(putResponse => {
            uuidIndex = connectionInfo.secret_ref.lastIndexOf('/')
            uuid = connectionInfo.secret_ref.substr(uuidIndex + 1)
            let newEndpoint = putResponse.data.endpoint

            Api.sendAjaxRequest({
              url: `${servicesUrl.barbican}/v1/secrets/${uuid}/payload`,
              method: 'GET',
              json: false,
              headers: { Accept: 'text/plain' },
            }).then(conInfoResponse => {
              newEndpoint.connection_info = {
                ...newEndpoint.connection_info,
                ...JSON.parse(conInfoResponse.data),
              }
              resolve(newEndpoint)
            }, reject).catch(reject)
          }, reject).catch(reject)
        }, reject).catch(reject)
      } else {
        Api.sendAjaxRequest({
          url: `${servicesUrl.coriolis}/${projectId}/endpoints/${endpoint.id}`,
          method: 'PUT',
          data: { endpoint: payload },
        }).then(response => {
          resolve(response.data.endpoint)
        }, reject).catch(reject)
      }
    })
  }
}

export default EdnpointSource
