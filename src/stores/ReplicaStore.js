import alt from '../alt'
import ReplicaActions from '../actions/ReplicaActions'

class ReplicaStore {
  constructor() {
    this.replicas = []
    this.loading = false

    this.bindListeners({
      handleLoadReplicas: ReplicaActions.LOAD_REPLICAS,
      handleLoadReplicasSuccess: ReplicaActions.LOAD_REPLICAS_SUCCESS,
      handleLoadReplicasFailed: ReplicaActions.LOAD_REPLICAS_FAILED,
    })
  }

  handleLoadReplicas() {
    this.replicas = []
    this.loading = true
  }

  handleLoadReplicasSuccess(replicas) {
    this.replicas = replicas
    this.loading = false
  }

  handleLoadReplicasFailed() {
    this.loading = false
  }
}

export default alt.createStore(ReplicaStore)
