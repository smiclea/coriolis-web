import alt from '../alt'

import ReplicaSource from '../sources/ReplicaSource'

class ReplicaActions {
  loadReplicas() {
    ReplicaSource.loadReplicas().then(
      response => { this.loadReplicasSuccess(response) },
      response => { this.loadReplicasFailed(response) },
    )
    return true
  }

  loadReplicasSuccess(replicas) {
    return replicas || true
  }

  loadReplicasFailed(response) {
    return response || true
  }

  loadReplicaExecutions(replicaId) {
    ReplicaSource.loadReplicaExecutions(replicaId).then(
      response => { this.loadReplicaExecutionsSuccess(response) },
      response => { this.loadReplicaExecutionsFailed(response) },
    )
    return replicaId
  }

  loadReplicaExecutionsSuccess({ replicaId, executions }) {
    return { replicaId, executions }
  }

  loadReplicaExecutionsFailed(response) {
    return response || true
  }

  getReplica(replicaId) {
    ReplicaSource.getReplica(replicaId).then(
      replica => { this.getReplicaSuccess(replica) },
      response => { this.getReplicaFailed(response) },
    )

    return replicaId
  }

  getReplicaSuccess(replica) {
    return replica
  }

  getReplicaFailed(response) {
    return response || true
  }
}

export default alt.createActions(ReplicaActions)
