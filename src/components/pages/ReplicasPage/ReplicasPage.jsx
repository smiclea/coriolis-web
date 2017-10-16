import React from 'react'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import { MainTemplate, Navigation, ReplicasList, PageHeader } from 'components'

import ProjectStore from '../../../stores/ProjectStore'
import UserStore from '../../../stores/UserStore'
import ReplicaStore from '../../../stores/ReplicaStore'
import ProjectActions from '../../../actions/ProjectActions'
import ReplicaActions from '../../../actions/ReplicaActions'
import UserActions from '../../../actions/UserActions'
import Wait from '../../../utils/Wait'


class ReplicasPage extends React.Component {
  static propTypes = {
    projectStore: PropTypes.object,
    replicaStore: PropTypes.object,
    userStore: PropTypes.object,
  }

  static getStores() {
    return [UserStore, ProjectStore, ReplicaStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      projectStore: ProjectStore.getState(),
      replicaStore: ReplicaStore.getState(),
    }
  }

  componentDidMount() {
    document.title = 'Coriolis Replicas'

    if (this.props.projectStore.projects.length === 0) {
      ProjectActions.getProjects()
    }

    if (this.props.replicaStore.replicas.length === 0) {
      ReplicaActions.loadReplicas()
    }
  }

  handleProjectChange(project) {
    Wait.for(() => {
      return UserStore.getState().user.project.id === project.id
    }, () => {
      ReplicaActions.loadReplicas()
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

  render() {
    return (
      <MainTemplate
        navigationComponent={<Navigation currentPage="replicas" />}
        listComponent={
          <ReplicasList replicas={this.props.replicaStore.replicas} />
        }
        headerComponent={
          <PageHeader
            title="Coriolis Replicas"
            projects={this.props.projectStore.projects}
            user={this.props.userStore.user}
            onProjectChange={project => { this.handleProjectChange(project) }}
            onUserItemClick={item => { this.handleUserItemClick(item) }}
          />
        }
      />
    )
  }
}

export default connectToStores(ReplicasPage)
