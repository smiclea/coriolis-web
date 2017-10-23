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

  getReplicaWithExecutions(replicaId) {
    ReplicaSource.getReplicaWithExecutions(replicaId).then(
      replica => { this.getReplicaWithExecutionsSuccess(replica) },
      response => { this.getReplicaWithExecutionsFailed(response) },
    )

    return replicaId
  }

  getReplicaWithExecutionsSuccess(replica) {
    return replica
  }

  getReplicaWithExecutionsFailed(response) {
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
}

export default alt.createActions(ReplicaActions)
