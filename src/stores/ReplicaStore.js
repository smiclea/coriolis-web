import alt from '../alt'
import ReplicaActions from '../actions/ReplicaActions'

class ReplicaStore {
  constructor() {
    this.replicas = []
    this.replicaDetails = {}
    this.loading = true
    this.detailsLoading = true

    this.bindListeners({
      handleLoadReplicas: ReplicaActions.LOAD_REPLICAS,
      handleLoadReplicasSuccess: ReplicaActions.LOAD_REPLICAS_SUCCESS,
      handleLoadReplicasFailed: ReplicaActions.LOAD_REPLICAS_FAILED,
      handleLoadReplicaExecutionsSuccess: ReplicaActions.LOAD_REPLICA_EXECUTIONS_SUCCESS,
      handleGetReplica: ReplicaActions.GET_REPLICA,
      handleGetReplicaSuccess: ReplicaActions.GET_REPLICA_SUCCESS,
      handleGetReplicaFailed: ReplicaActions.GET_REPLICA_FAILED,
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

    if (this.replicaDetails.id === replicaId) {
      this.replicaDetails.executions = executions
    }
  }

  handleGetReplica() {
    this.detailsLoading = true
    this.replicaDetails = {}
  }

  handleGetReplicaSuccess(replica) {
    this.detailsLoading = false
    this.replicaDetails = replica

    let oldReplicaInfo = this.replicas.find(r => r.id === replica.id)
    if (oldReplicaInfo) {
      this.replicaDetails.executions = oldReplicaInfo.executions
    }
  }

  handleGetReplicaFailed() {
    this.detailsLoading = false
  }
}

export default alt.createStore(ReplicaStore)
