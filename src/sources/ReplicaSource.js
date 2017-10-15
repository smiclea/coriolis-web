import cookie from 'js-cookie'

import Api from '../utils/ApiCaller'

import { servicesUrl } from '../config'

class ReplicaSource {
  static loadReplicas() {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/detail`,
        method: 'GET',
      }).then(response => {
        resolve(response.data.replicas)
      }, reject).catch(reject)
    })
  }
}

export default ReplicaSource

