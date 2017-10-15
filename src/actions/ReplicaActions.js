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
}

export default alt.createActions(ReplicaActions)
