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
      handleGetReplicaWithExecutions: ReplicaActions.GET_REPLICA_WITH_EXECUTIONS,
      handleGetReplicaWithExecutionsSuccess: ReplicaActions.GET_REPLICA_WITH_EXECUTIONS_SUCCESS,
      handleGetReplicaWithExecutionsFailed: ReplicaActions.GET_REPLICA_WITH_EXECUTIONS_FAILED,
    })
  }

  handleLoadReplicas() {
    this.loading = true
  }

  handleLoadReplicasSuccess(replicas) {
    this.replicas = replicas.map(replica => {
      let oldReplica = this.replicas.find(r => r.id === replica.id)
      if (oldReplica) {
        replica.executions = oldReplica.executions
      }

      return replica
    })
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
      this.replicaDetails = {
        ...this.replicaDetails,
        executions,
      }
    }
  }

  handleGetReplica() {
    this.detailsLoading = true
  }

  handleGetReplicaSuccess(replica) {
    this.detailsLoading = false
    this.replicaDetails = replica
  }

  handleGetReplicaFailed() {
    this.detailsLoading = false
  }

  handleGetReplicaWithExecutions() {
    this.detailsLoading = true
  }

  handleGetReplicaWithExecutionsSuccess(replica) {
    this.detailsLoading = false
    this.replicaDetails = replica
  }

  handleGetReplicaWithExecutionsFailed() {
    this.detailsLoading = false
  }
}

export default alt.createStore(ReplicaStore)
