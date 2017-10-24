import alt from '../alt'

import MigrationSource from '../sources/MigrationSource'

class MigrationActions {
  getMigrations() {
    MigrationSource.getMigrations().then(
      response => { this.getMigrationsSuccess(response) },
      response => { this.getMigrationsFailed(response) },
    )
    return true
  }

  getMigrationsSuccess(migrations) {
    return migrations || true
  }

  getMigrationsFailed(response) {
    return response || true
  }

  getMigration(migrationId) {
    MigrationSource.getMigration(migrationId).then(
      migration => { this.getMigrationSuccess(migration) },
      response => { this.getMigrationFailed(response) },
    )

    return migrationId
  }

  getMigrationSuccess(migration) {
    return migration
  }

  getMigrationFailed(response) {
    return response || true
  }

  cancel(migrationId) {
    MigrationSource.cancel(migrationId).then(
      () => { this.cancelSuccess(migrationId) },
      response => { this.cancelFailed(response) },
    )

    return { migrationId }
  }

  cancelSuccess(migrationId) {
    return { migrationId }
  }

  cancelFailed(response) {
    return response || true
  }

  delete(migrationId) {
    MigrationSource.delete(migrationId).then(
      () => { this.deleteSuccess(migrationId) },
      response => { this.deleteFailed(response) },
    )
    return migrationId
  }

  deleteSuccess(migrationId) {
    return migrationId
  }

  deleteFailed(response) {
    return response || true
  }

  migrateReplica(replicaId, options) {
    MigrationSource.migrateReplica(replicaId, options).then(
      migration => { this.migrateReplicaSuccess(migration) },
      response => { this.migrateReplicaFailed(response) },
    )

    return { replicaId, options }
  }

  migrateReplicaSuccess(migration) {
    return migration
  }

  migrateReplicaFailed(response) {
    return response || true
  }
}

export default alt.createActions(MigrationActions)
