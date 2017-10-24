import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import connectToStores from 'alt-utils/lib/connectToStores'

import { MainTemplate, Navigation, FilterList, PageHeader, ConfirmationModal } from 'components'

import replicaItemImage from './images/replica.svg'

import ProjectStore from '../../../stores/ProjectStore'
import UserStore from '../../../stores/UserStore'
import ReplicaStore from '../../../stores/ReplicaStore'
import EndpointStore from '../../../stores/EndpointStore'
import ProjectActions from '../../../actions/ProjectActions'
import ReplicaActions from '../../../actions/ReplicaActions'
import EndpointActions from '../../../actions/EndpointActions'
import UserActions from '../../../actions/UserActions'
import Wait from '../../../utils/Wait'
import NotificationActions from '../../../actions/NotificationActions'
import { requestPollTimeout } from '../../../config'

const Wrapper = styled.div``

class ReplicasPage extends React.Component {
  static propTypes = {
    projectStore: PropTypes.object,
    replicaStore: PropTypes.object,
    userStore: PropTypes.object,
    endpointStore: PropTypes.object,
  }

  static getStores() {
    return [UserStore, ProjectStore, ReplicaStore, EndpointStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      projectStore: ProjectStore.getState(),
      replicaStore: ReplicaStore.getState(),
      endpointStore: EndpointStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      showDeleteReplicaConfirmation: false,
      confirmationItems: null,
    }
  }

  componentDidMount() {
    document.title = 'Coriolis Replicas'

    ProjectActions.getProjects()
    ReplicaActions.loadReplicas()
    EndpointActions.getEndpoints()
    this.pollData()
    this.pollInterval = setInterval(() => { this.pollData() }, requestPollTimeout)
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }

  pollData() {
    Wait.for(() => this.props.replicaStore.replicas.length !== 0, () => {
      this.props.replicaStore.replicas.forEach(replica => {
        ReplicaActions.loadReplicaExecutions(replica.id)
      })
    })
  }

  handleProjectChange(project) {
    Wait.for(() => UserStore.getState().user.project.id === project.id, () => {
      ReplicaActions.loadReplicas()
      Wait.for(() => this.props.replicaStore.replicas.length !== 0, () => {
        this.props.replicaStore.replicas.forEach(replica => {
          ReplicaActions.loadReplicaExecutions(replica.id)
        })
      })
      EndpointActions.getEndpoints()
    })

    UserActions.switchProject(project.id)
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

  handleReloadButtonClick() {
    ReplicaActions.loadReplicas()
    Wait.for(() => this.props.replicaStore.replicas.length !== 0, () => {
      this.props.replicaStore.replicas.forEach(replica => {
        ReplicaActions.loadReplicaExecutions(replica.id)
      })
    })
  }

  handleItemClick(item) {
    window.location.href = `/#/replica/${item.id}`
  }

  handleActionChange(items, action) {
    if (action === 'execute') {
      items.forEach(replica => {
        ReplicaActions.execute(replica.id)
      })
      NotificationActions.notify('Executing replicas')
    } else if (action === 'delete') {
      this.setState({
        showDeleteReplicaConfirmation: true,
        confirmationItems: items,
      })
    }
  }

  handleCloseDeleteReplicaConfirmation() {
    this.setState({
      showDeleteReplicaConfirmation: false,
      confirmationItems: null,
    })
  }

  handleDeleteReplicaConfirmation() {
    this.state.confirmationItems.forEach(replica => {
      ReplicaActions.delete(replica.id)
    })
    this.handleCloseDeleteReplicaConfirmation()
  }

  render() {
    return (
      <Wrapper>
        <MainTemplate
          navigationComponent={<Navigation currentPage="replicas" />}
          listComponent={
            <FilterList
              type="replica"
              itemImage={replicaItemImage}
              loading={this.props.replicaStore.loading}
              items={this.props.replicaStore.replicas}
              endpoints={this.props.endpointStore.endpoints}
              onItemClick={item => { this.handleItemClick(item) }}
              onReloadButtonClick={() => { this.handleReloadButtonClick() }}
              onActionChange={(items, action) => { this.handleActionChange(items, action) }}
            />
          }
          headerComponent={
            <PageHeader
              title="Coriolis Replicas"
              projects={this.props.projectStore.projects}
              onProjectChange={project => { this.handleProjectChange(project) }}
              user={this.props.userStore.user}
              onUserItemClick={item => { this.handleUserItemClick(item) }}
            />
          }
        />
        <ConfirmationModal
          isOpen={this.state.showDeleteReplicaConfirmation}
          title="Delete Replicas?"
          message="Are you sure you want to delete the selected replicas?"
          extraMessage="Deleting a Coriolis Replica in permanent!"
          onConfirmation={() => { this.handleDeleteReplicaConfirmation() }}
          onRequestClose={() => { this.handleCloseDeleteReplicaConfirmation() }}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(ReplicasPage)
