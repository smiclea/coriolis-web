import alt from '../alt'
import ReplicaActions from '../actions/ReplicaActions'

class ReplicaStore {
  constructor() {
    this.replicas = []
    this.loading = true

    this.bindListeners({
      handleLoadReplicas: ReplicaActions.LOAD_REPLICAS,
      handleLoadReplicasSuccess: ReplicaActions.LOAD_REPLICAS_SUCCESS,
      handleLoadReplicasFailed: ReplicaActions.LOAD_REPLICAS_FAILED,
      handleLoadReplicaExecutionsSuccess: ReplicaActions.LOAD_REPLICA_EXECUTIONS_SUCCESS,
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

  handleLoadReplicaExecutionsSuccess({ replicaId, executions }) {
    let replica = this.replicas.find(replica => replica.id === replicaId)

    if (replica) {
      replica.executions = executions
    }
  }
}

export default alt.createStore(ReplicaStore)
