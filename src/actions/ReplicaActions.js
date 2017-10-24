import alt from '../alt'

import ReplicaSource from '../sources/ReplicaSource'

class ReplicaActions {
  getReplicas() {
    ReplicaSource.getReplicas().then(
      response => { this.getReplicasSuccess(response) },
      response => { this.getReplicasFailed(response) },
    )
    return true
  }

  getReplicasSuccess(replicas) {
    return replicas || true
  }

  getReplicasFailed(response) {
    return response || true
  }

  getReplicaExecutions(replicaId) {
    ReplicaSource.getReplicaExecutions(replicaId).then(
      response => { this.getReplicaExecutionsSuccess(response) },
      response => { this.getReplicaExecutionsFailed(response) },
    )
    return replicaId
  }

  getReplicaExecutionsSuccess({ replicaId, executions }) {
    return { replicaId, executions }
  }

  getReplicaExecutionsFailed(response) {
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

  execute(replicaId, fields) {
    ReplicaSource.execute(replicaId, fields).then(
      executions => { this.executeSuccess(executions) },
      response => { this.executeFailed(response) },
    )

    return replicaId
  }

  executeSuccess({ replicaId, execution }) {
    return { replicaId, execution }
  }

  executeFailed(response) {
    return response || true
  }

  cancelExecution(replicaId, executionId) {
    ReplicaSource.cancelExecution(replicaId, executionId).then(
      () => { this.cancelExecutionSuccess(replicaId, executionId) },
      response => { this.cancelExecutionFailed(response) },
    )

    return { replicaId, executionId }
  }

  cancelExecutionSuccess(replicaId, executionId) {
    return { replicaId, executionId }
  }

  cancelExecutionFailed(response) {
    return response || true
  }

  deleteExecution(replicaId, executionId) {
    ReplicaSource.deleteExecution(replicaId, executionId).then(
      () => { this.deleteExecutionSuccess(replicaId, executionId) },
      response => { this.deleteExecutionFailed(response) },
    )

    return { replicaId, executionId }
  }

  deleteExecutionSuccess(replicaId, executionId) {
    return { replicaId, executionId }
  }

  deleteExecutionFailed(response) {
    return response || true
  }

  delete(replicaId) {
    ReplicaSource.delete(replicaId).then(
      () => { this.deleteSuccess(replicaId) },
      response => { this.deleteFailed(response) },
    )
    return replicaId
  }

  deleteSuccess(replicaId) {
    return replicaId
  }

  deleteFailed(response) {
    return response || true
  }
}

export default alt.createActions(ReplicaActions)
