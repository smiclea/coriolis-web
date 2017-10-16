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

          connections.sort((c1, c2) => moment(c2.created_at).isAfter(c1.created_at))

          resolve(connections)
        }, reject).catch(reject)
      } else {
        reject()
      }
    })
  }
}

export default EdnpointSource
