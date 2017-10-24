import alt from '../alt'
import MigrationActions from '../actions/MigrationActions'
import NotificationActions from '../actions/NotificationActions'

class MigrationStore {
  constructor() {
    this.migrations = []
    this.migrationDetails = {}
    this.loading = true
    this.detailsGeting = true

    this.bindListeners({
      handleGetMigrations: MigrationActions.GET_MIGRATIONS,
      handleGetMigrationsSuccess: MigrationActions.GET_MIGRATIONS_SUCCESS,
      handleGetMigrationsFailed: MigrationActions.GET_MIGRATIONS_FAILED,
      handleGetMigration: MigrationActions.GET_MIGRATION,
      handleGetMigrationSuccess: MigrationActions.GET_MIGRATION_SUCCESS,
      handleGetMigrationFailed: MigrationActions.GET_MIGRATION_FAILED,
      handleDeleteSuccess: MigrationActions.DELETE_SUCCESS,
      handleMigrateReplicaSuccess: MigrationActions.MIGRATE_REPLICA_SUCCESS,
    })
  }

  handleGetMigrations() {
    this.loading = true
  }

  handleGetMigrationsSuccess(migrations) {
    this.migrations = migrations.map(migration => {
      let oldMigration = this.migrations.find(r => r.id === migration.id)
      if (oldMigration) {
        migration.executions = oldMigration.executions
      }

      return migration
    })
    this.loading = false
  }

  handleGetMigrationsFailed() {
    this.loading = false
  }

  handleGetMigration() {
    this.detailsLoading = true
  }

  handleGetMigrationSuccess(migration) {
    this.detailsLoading = false
    this.migrationDetails = migration
  }

  handleGetMigrationFailed() {
    this.detailsLoading = false
  }

  handleDeleteSuccess(migrationId) {
    this.migrations = this.migrations.filter(r => r.id !== migrationId)
  }

  handleMigrateReplicaSuccess(migration) {
    this.migrations = [
      migration,
      ...this.migrations,
    ]

    setTimeout(() => {
      NotificationActions.notify('Migration successfully created from replica.', 'success', {
        action: {
          label: 'View Migration Status',
          callback: () => {
            window.location.href = `/#/migration/tasks/${migration.id}`
          },
        },
      })
    }, 0)
  }
}

export default alt.createStore(MigrationStore)
