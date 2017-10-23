import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import {
  DetailsTemplate,
  DetailsPageHeader,
  DetailsContentHeader,
  ReplicaDetailsContent,
  Modal,
  ReplicaExecutionOptions,
  ConfirmationModal,
} from 'components'

import Wait from '../../../utils/Wait'
import ReplicaStore from '../../../stores/ReplicaStore'
import UserStore from '../../../stores/UserStore'
import UserActions from '../../../actions/UserActions'
import ReplicaActions from '../../../actions/ReplicaActions'
import EndpointStore from '../../../stores/EndpointStore'
import EndpointActions from '../../../actions/EndpointActions'
import NotificationActions from '../../../actions/NotificationActions'
import { requestPollTimeout } from '../../../config'

import replicaImage from './images/replica.svg'

const Wrapper = styled.div``

class ReplicaDetailsPage extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    replicaStore: PropTypes.object,
    endpointStore: PropTypes.object,
    userStore: PropTypes.object,
  }

  static getStores() {
    return [ReplicaStore, EndpointStore, UserStore]
  }

  static getPropsFromStores() {
    return {
      replicaStore: ReplicaStore.getState(),
      endpointStore: EndpointStore.getState(),
      userStore: UserStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      showOptionsModal: false,
      showDeleteExecutionConfirmation: false,
      confirmationItem: null,
    }
  }

  componentDidMount() {
    document.title = 'Replica Details'
    this.loadData(true)
    this.pollInterval = setInterval(() => { this.loadData() }, requestPollTimeout)
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }

  handleUserItemClick(item) {
    switch (item.value) {
      case 'signout':
        UserActions.logout()
        return
      case 'profile':
        window.location.href = '/#/profile'
        break
      default:
    }
  }

  handleBackButtonClick() {
    window.location.href = '/#/replicas'
  }

  handleActionButtonClick() {
    this.setState({ showOptionsModal: true })
  }

  handleCloseOptionsModal() {
    this.setState({ showOptionsModal: false })
  }

  handleCancelExecutionClick(execution) {
    NotificationActions.notify('Cancelling execution')
    ReplicaActions.cancelExecution(this.props.replicaStore.replicaDetails.id, execution.id)
  }

  handleDeleteExecutionConfirmation() {
    ReplicaActions.deleteExecution(this.props.replicaStore.replicaDetails.id, this.state.confirmationItem.id)
    this.handleCloseExecutionConfirmation()
  }

  handleDeleteExecutionClick(execution) {
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

  executeReplica(fields) {
    ReplicaActions.execute(this.props.replicaStore.replicaDetails.id, fields)
  }

  loadData(fullReload) {
    if (!fullReload) {
      Wait.for(() => this.props.replicaStore.replicaDetails.id === this.props.match.params.id,
        () => { ReplicaActions.loadReplicaExecutions(this.props.match.params.id) })
      return
    }

    ReplicaActions.getReplica(this.props.match.params.id)
    Wait.for(() => this.props.replicaStore.replicaDetails.id === this.props.match.params.id,
      () => { ReplicaActions.loadReplicaExecutions(this.props.match.params.id) })
    EndpointActions.getEndpoints()
  }

  render() {
    return (
      <Wrapper>
        <DetailsTemplate
          pageHeaderComponent={<DetailsPageHeader
            user={this.props.userStore.user}
            onUserItemClick={item => { this.handleUserItemClick(item) }}
          />}
          contentHeaderComponent={<DetailsContentHeader
            item={this.props.replicaStore.replicaDetails}
            onBackButonClick={() => { this.handleBackButtonClick() }}
            onActionButtonClick={() => { this.handleActionButtonClick() }}
            typeImage={replicaImage}
            alertInfoPill
            buttonLabel="Execute Now"
          />}
          contentComponent={<ReplicaDetailsContent
            item={this.props.replicaStore.replicaDetails}
            endpoints={this.props.endpointStore.endpoints}
            page={this.props.match.params.page || ''}
            onCancelExecutionClick={execution => { this.handleCancelExecutionClick(execution) }}
            onDeleteExecutionClick={execution => { this.handleDeleteExecutionClick(execution) }}
            onExecuteClick={() => { this.handleActionButtonClick() }}
          />}
        />
        <Modal
          isOpen={this.state.showOptionsModal}
          title="New Execution"
          onRequestClose={() => { this.handleCloseOptionsModal() }}
        >
          <ReplicaExecutionOptions
            onCancelClick={() => { this.handleCloseOptionsModal() }}
            onExecuteClick={fields => { this.handleCloseOptionsModal(); this.executeReplica(fields) }}
          />
        </Modal>
        <ConfirmationModal
          isOpen={this.state.showDeleteExecutionConfirmation}
          title="Delete Execution?"
          message="Are you sure you want to delete this execution?"
          extraMessage="Deleting a Coriolis Execution in permanent!"
          onConfirmation={() => { this.handleDeleteExecutionConfirmation() }}
          onRequestClose={() => { this.handleCloseExecutionConfirmation() }}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(ReplicaDetailsPage)
