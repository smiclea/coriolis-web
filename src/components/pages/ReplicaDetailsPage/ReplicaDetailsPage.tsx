/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import DetailsTemplate from '../../templates/DetailsTemplate'
import DetailsPageHeader from '../../organisms/DetailsPageHeader'
import DetailsContentHeader from '../../organisms/DetailsContentHeader'
import ReplicaDetailsContent from '../../organisms/ReplicaDetailsContent'
import Modal from '../../molecules/Modal'
import ReplicaExecutionOptions from '../../organisms/ReplicaExecutionOptions'
import AlertModal from '../../organisms/AlertModal'
import EditReplica from '../../organisms/EditReplica'
import ReplicaMigrationOptions from '../../organisms/ReplicaMigrationOptions'
import DeleteReplicaModal from '../../molecules/DeleteReplicaModal'

import type { InstanceScript } from '../../../@types/Instance'
import type { Execution } from '../../../@types/Execution'
import type { Schedule } from '../../../@types/Schedule'
import type { Field } from '../../../@types/Field'
import type { Action as DropdownAction } from '../../molecules/ActionDropdown'

import replicaStore from '../../../stores/ReplicaStore'
import migrationStore from '../../../stores/MigrationStore'
import userStore from '../../../stores/UserStore'
import endpointStore from '../../../stores/EndpointStore'
import scheduleStore from '../../../stores/ScheduleStore'
import instanceStore from '../../../stores/InstanceStore'
import networkStore from '../../../stores/NetworkStore'
import notificationStore from '../../../stores/NotificationStore'
import providerStore from '../../../stores/ProviderStore'

import configLoader from '../../../utils/Config'
import { providerTypes } from '../../../constants'

import replicaImage from './images/replica.svg'
import Palette from '../../styleUtils/Palette'
import { ReplicaItemDetails } from '../../../@types/MainItem'
import ObjectUtils from '../../../utils/ObjectUtils'
import minionPoolStore from '../../../stores/MinionPoolStore'

const Wrapper = styled.div<any>``

type Props = {
  match: { params: { id: string, page: string | null } },
  history: any,
}
type State = {
  showOptionsModal: boolean,
  showMigrationModal: boolean,
  showEditModal: boolean,
  showDeleteExecutionConfirmation: boolean,
  showForceCancelConfirmation: boolean,
  showDeleteReplicaConfirmation: boolean,
  showDeleteReplicaDisksConfirmation: boolean,
  confirmationItem?: ReplicaItemDetails | null | Execution | null,
  showCancelConfirmation: boolean,
  isEditable: boolean,
  pausePolling: boolean,
}
@observer
class ReplicaDetailsPage extends React.Component<Props, State> {
  state: State = {
    showOptionsModal: false,
    showMigrationModal: false,
    showEditModal: false,
    showDeleteExecutionConfirmation: false,
    showDeleteReplicaConfirmation: false,
    showDeleteReplicaDisksConfirmation: false,
    confirmationItem: null,
    showCancelConfirmation: false,
    showForceCancelConfirmation: false,
    isEditable: false,
    pausePolling: false,
  }

  stopPolling: boolean | null = null

  componentDidMount() {
    document.title = 'Replica Details'

    const loadReplica = async () => {
      await endpointStore.getEndpoints({ showLoading: true })
      const replica = await this.loadReplicaWithInstances(true)
      if (!replica) {
        return
      }
      const sourceEndpoint = endpointStore.endpoints.find(e => e.id === replica.origin_endpoint_id)
      const destinationEndpoint = endpointStore.endpoints
        .find(e => e.id === replica.destination_endpoint_id)
      if (!sourceEndpoint || !destinationEndpoint) {
        return
      }
      const loadOptions = async (optionsType: 'source' | 'destination') => {
        const providerName = optionsType === 'source' ? sourceEndpoint.type : destinationEndpoint.type
        // This allows the values to be displayed with their allocated names instead of their IDs
        await providerStore.loadOptionsSchema({
          providerName,
          optionsType,
          useCache: true,
          quietError: true,
        })
        const getOptionsValuesConfig = {
          optionsType,
          endpointId: optionsType === 'source' ? replica.origin_endpoint_id : replica.destination_endpoint_id,
          providerName,
          useCache: true,
          quietError: true,
          allowMultiple: true,
        }
        // For some providers, the API doesn't return the required fields values
        // if those required fields are sent in env data,
        // so to retrieve those values a request without env data must be made
        await providerStore.getOptionsValues(getOptionsValuesConfig)
        await providerStore.getOptionsValues({
          ...getOptionsValuesConfig,
          envData: optionsType === 'source' ? replica.source_environment : replica.destination_environment,
        })
      }

      loadOptions('source')
      loadOptions('destination')
    }
    loadReplica()

    scheduleStore.getSchedules(this.replicaId)
    this.pollData(true)
  }

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    if (newProps.match.params.id !== this.props.match.params.id) {
      this.loadReplicaWithInstances(true, newProps.match.params.id)
      scheduleStore.getSchedules(newProps.match.params.id)
    }
  }

  componentWillUnmount() {
    replicaStore.clearDetails()
    scheduleStore.clearUnsavedSchedules()
    this.stopPolling = true
  }

  get replicaId() {
    if (!this.props.match || !this.props.match.params || !this.props.match.params.id) {
      throw new Error('Invalid replica id')
    }
    return this.props.match.params.id
  }

  get replica() {
    return replicaStore.replicaDetails
  }

  getLastExecution() {
    const replica = this.replica
    if (replica && replica.executions && replica.executions.length) {
      return replica.executions[replica.executions.length - 1]
    }
    return null
  }

  getStatus() {
    const lastExecution = this.getLastExecution()
    return lastExecution && lastExecution.status
  }

  async loadIsEditable(replicaDetails: ReplicaItemDetails) {
    const targetEndpointId = replicaDetails.destination_endpoint_id
    const sourceEndpointId = replicaDetails.origin_endpoint_id
    await ObjectUtils.waitFor(() => endpointStore.endpoints.length > 0)
    const sourceEndpoint = endpointStore.endpoints.find(e => e.id === sourceEndpointId)
    const targetEndpoint = endpointStore.endpoints.find(e => e.id === targetEndpointId)
    if (!sourceEndpoint || !targetEndpoint || !providerStore.providers) {
      return
    }
    const sourceProviderTypes = providerStore.providers[sourceEndpoint.type]
    const targetProviderTypes = providerStore.providers[targetEndpoint.type]
    const isEditable = sourceProviderTypes && targetProviderTypes
      ? !!sourceProviderTypes.types.find(t => t === providerTypes.SOURCE_UPDATE)
      && !!targetProviderTypes.types.find(t => t === providerTypes.TARGET_UPDATE)
      : false

    this.setState({ isEditable })
  }

  async loadReplicaWithInstances(cache: boolean, replicaId?: string) {
    await replicaStore.getReplicaDetails({ replicaId: replicaId || this.replicaId })
    const replica = this.replica
    if (!replica) {
      return null
    }
    minionPoolStore.loadMinionPools()

    await providerStore.loadProviders()

    this.loadIsEditable(replica)

    networkStore.loadNetworks(replica.destination_endpoint_id, replica.destination_environment, {
      quietError: true,
      cache,
    })

    const targetEndpoint = endpointStore.endpoints
      .find(e => e.id === replica.destination_endpoint_id)

    const hasStorageMap = targetEndpoint ? (providerStore.providers && providerStore.providers[targetEndpoint.type]
      ? !!providerStore.providers[targetEndpoint.type]
        .types.find(t => t === providerTypes.STORAGE)
      : false) : false
    if (hasStorageMap) {
      endpointStore.loadStorage(replica.destination_endpoint_id, replica.destination_environment)
    }

    instanceStore.loadInstancesDetails({
      endpointId: replica.origin_endpoint_id,
      instances: replica.instances.map(n => ({ id: n })),
      cache,
      quietError: false,
      env: replica.source_environment,
      targetProvider: targetEndpoint?.type,
    })
    return replica
  }

  isExecuteDisabled() {
    const replica = this.replica
    if (!replica) {
      return true
    }
    const originEndpoint = endpointStore.endpoints.find(e => e.id === replica.origin_endpoint_id)
    const targetEndpoint = endpointStore.endpoints
      .find(e => e.id === replica.destination_endpoint_id)
    const status = this.getStatus()

    return Boolean(!originEndpoint || !targetEndpoint || status === 'RUNNING' || status === 'CANCELLING' || status === 'AWAITING_MINION_ALLOCATIONS')
  }

  handleUserItemClick(item: { value: string }) {
    switch (item.value) {
      case 'signout':
        userStore.logout()
        break
      default:
    }
  }

  handleExecuteClick() {
    this.setState({ showOptionsModal: true })
  }

  handleCloseOptionsModal() {
    this.setState({ showOptionsModal: false })
  }

  handleDeleteExecutionConfirmation() {
    const replica = this.replica
    if (!this.state.confirmationItem || !replica) {
      return
    }
    replicaStore.deleteExecution(replica.id, this.state.confirmationItem.id)
    this.handleCloseExecutionConfirmation()
  }

  handleDeleteExecutionClick(execution?: Execution | null) {
    this.setState({
      showDeleteExecutionConfirmation: true,
      confirmationItem: execution,
    })
  }

  handleCloseExecutionConfirmation() {
    this.setState({
      showDeleteExecutionConfirmation: false,
      confirmationItem: null,
    })
  }

  handleDeleteReplicaClick() {
    this.setState({ showDeleteReplicaConfirmation: true })
  }

  handleDeleteReplicaDisksClick() {
    this.setState({ showDeleteReplicaDisksConfirmation: true })
  }

  handleDeleteReplicaConfirmation() {
    this.setState({ showDeleteReplicaConfirmation: false })
    const replica = this.replica
    if (!replica) {
      return
    }
    this.props.history.push('/replicas')
    replicaStore.delete(replica.id)
  }

  handleCloseDeleteReplicaConfirmation() {
    this.setState({ showDeleteReplicaConfirmation: false })
  }

  handleDeleteReplicaDisksConfirmation() {
    this.setState({
      showDeleteReplicaDisksConfirmation: false, showDeleteReplicaConfirmation: false,
    })
    const replica = this.replica
    if (!replica) {
      return
    }
    replicaStore.deleteDisks(replica.id)
    this.props.history.push(`/replicas/${replica.id}/executions`)
  }

  handleCloseDeleteReplicaDisksConfirmation() {
    this.setState({ showDeleteReplicaDisksConfirmation: false })
  }

  handleCloseMigrationModal() {
    this.setState({ showMigrationModal: false, pausePolling: false })
  }

  handleCreateMigrationClick() {
    this.setState({ showMigrationModal: true, pausePolling: true })
  }

  handleReplicaEditClick() {
    this.setState({ showEditModal: true, pausePolling: true })
  }

  handleAddScheduleClick(schedule: Schedule) {
    scheduleStore.addSchedule(this.replicaId, schedule)
  }

  handleScheduleChange(scheduleId: string | null, data: Schedule, forceSave?: boolean) {
    const oldData = scheduleStore.schedules.find(s => s.id === scheduleId)
    const unsavedData = scheduleStore.unsavedSchedules.find(s => s.id === scheduleId)

    if (scheduleId) {
      scheduleStore.updateSchedule(
        this.replicaId, scheduleId, data, oldData, unsavedData, forceSave,
      )
    }
  }

  handleScheduleSave(schedule: Schedule) {
    if (schedule.id) {
      scheduleStore.updateSchedule(this.replicaId, schedule.id, schedule, schedule, schedule, true)
    }
  }

  handleScheduleRemove(scheduleId: string | null) {
    if (scheduleId) {
      scheduleStore.removeSchedule(this.replicaId, scheduleId)
    }
  }

  handleCancelLastExecutionClick(force?: boolean) {
    this.handleCancelExecution(this.getLastExecution(), force)
  }

  handleCancelExecution(confirmationItem?: Execution | null, force?: boolean | null) {
    if (force) {
      this.setState({ confirmationItem, showForceCancelConfirmation: true })
    } else {
      this.setState({ confirmationItem, showCancelConfirmation: true })
    }
  }

  handleCloseCancelConfirmation() {
    this.setState({
      showForceCancelConfirmation: false,
      showCancelConfirmation: false,
    })
  }

  handleCancelConfirmation(force?: boolean) {
    const replica = this.replica
    if (!this.state.confirmationItem || !replica) {
      return
    }
    replicaStore.cancelExecution({
      replicaId: replica.id,
      executionId: this.state.confirmationItem.id,
      force,
    })
    this.setState({
      showForceCancelConfirmation: false,
      showCancelConfirmation: false,
    })
  }

  migrateReplica(
    options: Field[],
    uploadedScripts: InstanceScript[],
    removedScripts: InstanceScript[],
    minionPoolMappings: { [instance: string]: string },
  ) {
    this.migrate(options, uploadedScripts, removedScripts, minionPoolMappings)
    this.handleCloseMigrationModal()
  }

  async migrate(
    options: Field[],
    uploadedScripts: InstanceScript[],
    removedScripts: InstanceScript[],
    minionPoolMappings: { [instance: string]: string },
  ) {
    const replica = this.replica
    if (!replica) {
      return
    }
    const migration = await migrationStore.migrateReplica(
      replica.id,
      options,
      uploadedScripts,
      removedScripts,
      replica.user_scripts,
      minionPoolMappings,
    )
    notificationStore.alert('Migration successfully created from replica.', 'success', {
      action: {
        label: 'View Migration Status',
        callback: () => {
          this.props.history.push(`/migrations/${migration.id}/tasks/`)
        },
      },
    })
  }

  executeReplica(fields: Field[]) {
    const replica = this.replica
    if (!replica) {
      return
    }
    replicaStore.execute(replica.id, fields)
    this.handleCloseOptionsModal()
    this.props.history.push(`/replicas/${replica.id}/executions`)
  }

  async pollData(showLoading: boolean) {
    if (this.state.pausePolling || this.stopPolling) {
      return
    }

    await Promise.all([
      replicaStore.getReplicaDetails({
        replicaId: this.replicaId, showLoading, polling: true,
      }),
      (async () => {
        if (window.location.pathname.indexOf('executions') > -1) {
          await replicaStore.getExecutionTasks({ replicaId: this.replicaId, polling: true })
        }
      })(),
    ])

    setTimeout(() => { this.pollData(false) }, configLoader.config.requestPollTimeout)
  }

  closeEditModal() {
    this.setState({ showEditModal: false, pausePolling: false }, () => {
      this.pollData(false)
    })
  }

  handleEditReplicaReload() {
    this.loadReplicaWithInstances(false)
  }

  handleUpdateComplete(redirectTo: string) {
    this.props.history.push(redirectTo)
    this.closeEditModal()
  }

  async handleExecutionChange(executionId: string) {
    await ObjectUtils.waitFor(() => Boolean(replicaStore.replicaDetails))
    if (!replicaStore.replicaDetails?.id) {
      return
    }
    replicaStore.getExecutionTasks({ replicaId: replicaStore.replicaDetails.id, executionId })
  }

  renderEditReplica() {
    const replica = this.replica
    if (!replica) {
      return null
    }
    const sourceEndpoint = endpointStore.endpoints
      .find(e => e.id === replica.origin_endpoint_id)
    const destinationEndpoint = endpointStore.endpoints
      .find(e => e.id === replica.destination_endpoint_id)

    if (!this.state.showEditModal || !destinationEndpoint || !sourceEndpoint) {
      return null
    }

    return (
      <EditReplica
        isOpen
        type="replica"
        sourceEndpoint={sourceEndpoint}
        onUpdateComplete={url => { this.handleUpdateComplete(url) }}
        onRequestClose={() => { this.closeEditModal() }}
        replica={replica}
        destinationEndpoint={destinationEndpoint}
        instancesDetails={instanceStore.instancesDetails}
        instancesDetailsLoading={instanceStore.loadingInstancesDetails}
        networks={networkStore.networks}
        networksLoading={networkStore.loading}
        onReloadClick={() => { this.handleEditReplicaReload() }}
      />
    )
  }

  render() {
    const editTitle = providerStore.providersLoading ? 'Loading providers data' : !this.state.isEditable ? 'One of the platform plugins doesn\'t support editing replica option.' : null
    const dropdownActions: DropdownAction[] = [
      {
        label: 'Execute',
        action: () => { this.handleExecuteClick() },
        hidden: this.isExecuteDisabled(),
      },
      {
        label: 'Cancel',
        hidden: this.getStatus() !== 'RUNNING' && this.getStatus() !== 'AWAITING_MINION_ALLOCATIONS',
        action: () => { this.handleCancelLastExecutionClick() },
      },
      {
        label: 'Force Cancel',
        hidden: this.getStatus() !== 'CANCELLING',
        action: () => { this.handleCancelLastExecutionClick(true) },
      },
      {
        label: 'Create Migration',
        color: Palette.primary,
        action: () => { this.handleCreateMigrationClick() },
      },
      {
        label: 'Edit',
        title: editTitle,
        action: () => { this.handleReplicaEditClick() },
        disabled: !this.state.isEditable,
      },
      {
        label: 'Delete Disks',
        action: () => { this.handleDeleteReplicaDisksClick() },
      },
      {
        label: 'Delete Replica',
        color: Palette.alert,
        action: () => { this.handleDeleteReplicaClick() },
      },
    ]
    const replica = this.replica
    let title = null
    if (replica) {
      const { instances } = replica
      if (instances) {
        title = instances[0]
        if (instances.length > 1) {
          title += ` (+${instances.length - 1} more)`
        }
      } else {
        title = replica.name
      }
    }
    return (
      <Wrapper>
        <DetailsTemplate
          pageHeaderComponent={(
            <DetailsPageHeader
              user={userStore.loggedUser}
              onUserItemClick={item => { this.handleUserItemClick(item) }}
            />
)}
          contentHeaderComponent={(
            <DetailsContentHeader
              statusPill={replica?.last_execution_status}
              itemTitle={title}
              itemType="replica"
              itemDescription={replica?.description}
              dropdownActions={dropdownActions}
              backLink="/replicas"
              typeImage={replicaImage}
              alertInfoPill
            />
)}
          contentComponent={(
            <ReplicaDetailsContent
              item={replica}
              itemId={this.replicaId}
              instancesDetails={instanceStore.instancesDetails}
              instancesDetailsLoading={instanceStore.loadingInstancesDetails || endpointStore.storageLoading || providerStore.providersLoading}
              endpoints={endpointStore.endpoints}
              storageBackends={endpointStore.storageBackends}
              scheduleStore={scheduleStore}
              networks={networkStore.networks}
              minionPools={minionPoolStore.minionPools}
              detailsLoading={replicaStore.replicaDetailsLoading || endpointStore.loading
                || minionPoolStore.loadingMinionPools}
              sourceSchema={providerStore.sourceSchema}
              sourceSchemaLoading={providerStore.sourceSchemaLoading
              || providerStore.sourceOptionsPrimaryLoading
              || providerStore.sourceOptionsSecondaryLoading}
              destinationSchema={providerStore.destinationSchema}
              destinationSchemaLoading={providerStore.destinationSchemaLoading
              || providerStore.destinationOptionsPrimaryLoading
              || providerStore.destinationOptionsSecondaryLoading}
              executionsLoading={replicaStore.startingExecution
                || replicaStore.replicaDetailsLoading}
              onExecutionChange={id => { this.handleExecutionChange(id) }}
              executions={replicaStore.replicaDetails?.executions || []}
              executionsTasksLoading={replicaStore.executionsTasksLoading
                || replicaStore.replicaDetailsLoading || replicaStore.startingExecution}
              executionsTasks={replicaStore.executionsTasks}
              page={this.props.match.params.page || ''}
              onCancelExecutionClick={(e, f) => { this.handleCancelExecution(e, f) }}
              onDeleteExecutionClick={execution => { this.handleDeleteExecutionClick(execution) }}
              onExecuteClick={() => { this.handleExecuteClick() }}
              onCreateMigrationClick={() => { this.handleCreateMigrationClick() }}
              onDeleteReplicaClick={() => { this.handleDeleteReplicaClick() }}
              onAddScheduleClick={schedule => { this.handleAddScheduleClick(schedule) }}
              onScheduleChange={(scheduleId, data, forceSave) => {
                this.handleScheduleChange(scheduleId, data, forceSave)
              }}
              onScheduleRemove={scheduleId => { this.handleScheduleRemove(scheduleId) }}
              onScheduleSave={s => { this.handleScheduleSave(s) }}
            />
)}
        />
        <Modal
          isOpen={this.state.showOptionsModal}
          title="New Execution"
          onRequestClose={() => { this.handleCloseOptionsModal() }}
        >
          <ReplicaExecutionOptions
            onCancelClick={() => { this.handleCloseOptionsModal() }}
            onExecuteClick={fields => { this.executeReplica(fields) }}
          />
        </Modal>
        {this.state.showMigrationModal ? (
          <Modal
            isOpen
            title="Create Migration from Replica"
            onRequestClose={() => { this.handleCloseMigrationModal() }}
          >
            <ReplicaMigrationOptions
              transferItem={this.replica}
              minionPools={minionPoolStore.minionPools.filter(m => m.endpoint_id === this.replica?.destination_endpoint_id && m.platform === 'destination')}
              loadingInstances={instanceStore.loadingInstancesDetails}
              instances={instanceStore.instancesDetails}
              onCancelClick={() => { this.handleCloseMigrationModal() }}
              onMigrateClick={(o, s, r, m) => { this.migrateReplica(o, s, r, m) }}
            />
          </Modal>
        ) : null}
        <AlertModal
          isOpen={this.state.showDeleteExecutionConfirmation}
          title="Delete Execution?"
          message="Are you sure you want to delete this execution?"
          extraMessage="Deleting a Coriolis Execution is permanent!"
          onConfirmation={() => { this.handleDeleteExecutionConfirmation() }}
          onRequestClose={() => { this.handleCloseExecutionConfirmation() }}
        />
        {this.state.showDeleteReplicaConfirmation ? (
          <DeleteReplicaModal
            hasDisks={replicaStore.testReplicaHasDisks(this.replica)}
            onRequestClose={() => this.handleCloseDeleteReplicaConfirmation()}
            onDeleteReplica={() => { this.handleDeleteReplicaConfirmation() }}
            onDeleteDisks={() => { this.handleDeleteReplicaDisksConfirmation() }}
          />
        ) : null}
        <AlertModal
          isOpen={this.state.showDeleteReplicaDisksConfirmation}
          title="Delete Replica Disks?"
          message="Are you sure you want to delete this replica's disks?"
          extraMessage="Deleting Coriolis Replica Disks is permanent!"
          onConfirmation={() => { this.handleDeleteReplicaDisksConfirmation() }}
          onRequestClose={() => { this.handleCloseDeleteReplicaDisksConfirmation() }}
        />
        <AlertModal
          isOpen={this.state.showCancelConfirmation}
          title="Cancel Execution?"
          message="Are you sure you want to cancel the current execution?"
          extraMessage=" "
          onConfirmation={() => { this.handleCancelConfirmation() }}
          onRequestClose={() => { this.handleCloseCancelConfirmation() }}
        />
        <AlertModal
          isOpen={this.state.showForceCancelConfirmation}
          title="Force Cancel Execution?"
          message="Are you sure you want to force cancel the current execution?"
          extraMessage={`
The execution is currently being cancelled.
Would you like to force its cancellation?
Note that this may lead to scheduled cleanup tasks being forcibly skipped, and thus manual cleanup of temporary resources on the source/destination platforms may be required.`}
          onConfirmation={() => { this.handleCancelConfirmation(true) }}
          onRequestClose={() => { this.handleCloseCancelConfirmation() }}
        />
        {this.renderEditReplica()}
      </Wrapper>
    )
  }
}

export default ReplicaDetailsPage
