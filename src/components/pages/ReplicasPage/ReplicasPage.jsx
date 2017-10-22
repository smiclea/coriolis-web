import React from 'react'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import { MainTemplate, Navigation, FilterList, PageHeader } from 'components'

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

  componentDidMount() {
    document.title = 'Coriolis Replicas'

    ProjectActions.getProjects()
    ReplicaActions.loadReplicas()
    Wait.for(() => this.props.replicaStore.replicas.length !== 0, () => {
      this.props.replicaStore.replicas.forEach(replica => {
        ReplicaActions.loadReplicaExecutions(replica.id)
      })
    })
    EndpointActions.getEndpoints()
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

  render() {
    return (
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
    )
  }
}

export default connectToStores(ReplicasPage)
