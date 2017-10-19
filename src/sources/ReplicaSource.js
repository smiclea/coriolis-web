import cookie from 'js-cookie'
import moment from 'moment'

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
        let replicas = response.data.replicas
        replicas.sort((a, b) => {
          let aLastExecution = a.executions && a.executions.length ?
            a.executions[a.executions.length - 1].updated_at : null
          let bLastExecution = b.executions && b.executions.length ?
            b.executions[b.executions.length - 1].updated_at : null
          let aTime = aLastExecution || a.updated_at || a.created_at
          let bTime = bLastExecution || b.updated_at || b.created_at
          return moment(bTime).diff(moment(aTime))
        })
        resolve(replicas)
      }, reject).catch(reject)
    })
  }

  static loadReplicaExecutions(replicaId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')
      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/${replicaId}/executions/detail`,
        method: 'GET',
      }).then((response) => {
        resolve({ replicaId, executions: response.data.executions.sort((a, b) => a.number - b.number) })
      }, reject).catch(reject)
    })
  }

  static getReplica(replicaId) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/replicas/${replicaId}`,
        method: 'GET',
      }).then(response => {
        resolve(response.data.replica)
      }, reject).catch(reject)
    })
  }
}

export default ReplicaSource

