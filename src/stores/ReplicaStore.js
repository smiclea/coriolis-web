import alt from '../alt'
import ReplicaActions from '../actions/ReplicaActions'
import NotificationActions from '../actions/NotificationActions'

class ReplicaStore {
  constructor() {
    this.replicas = []
    this.replicaDetails = {}
    this.loading = true

    this.bindListeners({
      handleGetReplicas: ReplicaActions.GET_REPLICAS,
      handleGetReplicasSuccess: ReplicaActions.GET_REPLICAS_SUCCESS,
      handleGetReplicasFailed: ReplicaActions.GET_REPLICAS_FAILED,
      handleGetReplicaExecutionsSuccess: ReplicaActions.GET_REPLICA_EXECUTIONS_SUCCESS,
      handleGetReplica: ReplicaActions.GET_REPLICA,
      handleGetReplicaSuccess: ReplicaActions.GET_REPLICA_SUCCESS,
      handleGetReplicaFailed: ReplicaActions.GET_REPLICA_FAILED,
      handleExecute: ReplicaActions.EXECUTE,
      handleExecuteSuccess: ReplicaActions.EXECUTE_SUCCESS,
      handleExecuteFailed: ReplicaActions.EXECUTE_FAILED,
      handleDeleteExecutionSuccess: ReplicaActions.DELETE_EXECUTION_SUCCESS,
      handleDeleteSuccess: ReplicaActions.DELETE_SUCCESS,
      handleCancelExecutionSuccess: ReplicaActions.CANCEL_EXECUTION_SUCCESS,
    })
  }

  handleGetReplicas() {
    this.loading = true
  }

  handleGetReplicasSuccess(replicas) {
    this.replicas = replicas.map(replica => {
      let oldReplica = this.replicas.find(r => r.id === replica.id)
      if (oldReplica) {
        replica.executions = oldReplica.executions
      }

      return replica
    })
    this.loading = false
  }

  handleGetReplicasFailed() {
    this.loading = false
  }

  handleGetReplicaExecutionsSuccess({ replicaId, executions }) {
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

  handleExecute() {
    this.detailsLoading = true
  }

  handleExecuteSuccess({ replicaId, execution }) {
    let executions = [execution]

    if (this.replicaDetails.id === replicaId) {
      if (this.replicaDetails.executions) {
        executions = [...this.replicaDetails.executions, execution]
      }

      this.replicaDetails = {
        ...this.replicaDetails,
        executions,
      }
    }
  }

  handleExecuteFailed() {
    this.detailsLoading = false
  }

  handleDeleteExecutionSuccess({ replicaId, executionId }) {
    let executions = []

    if (this.replicaDetails.id === replicaId) {
      if (this.replicaDetails.executions) {
        executions = [...this.replicaDetails.executions.filter(e => e.id !== executionId)]
      }

      this.replicaDetails = {
        ...this.replicaDetails,
        executions,
      }
    }
  }

  handleDeleteSuccess(replicaId) {
    this.replicas = this.replicas.filter(r => r.id !== replicaId)
  }

  handleCancelExecutionSuccess() {
    setTimeout(() => { NotificationActions.notify('Cancelled', 'success') }, 0)
  }
}

export default alt.createStore(ReplicaStore)
