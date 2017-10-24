import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import connectToStores from 'alt-utils/lib/connectToStores'

import { MainTemplate, Navigation, FilterList, PageHeader, ConfirmationModal } from 'components'

import migrationItemImage from './images/migration.svg'

import ProjectStore from '../../../stores/ProjectStore'
import UserStore from '../../../stores/UserStore'
import MigrationStore from '../../../stores/MigrationStore'
import EndpointStore from '../../../stores/EndpointStore'
import ProjectActions from '../../../actions/ProjectActions'
import MigrationActions from '../../../actions/MigrationActions'
import EndpointActions from '../../../actions/EndpointActions'
import UserActions from '../../../actions/UserActions'
import Wait from '../../../utils/Wait'
import NotificationActions from '../../../actions/NotificationActions'

const Wrapper = styled.div``

const BulkActions = [
  { label: 'Cancel', value: 'cancel' },
  { label: 'Delete', value: 'delete' },
]

class MigrationsPage extends React.Component {
  static propTypes = {
    projectStore: PropTypes.object,
    migrationStore: PropTypes.object,
    userStore: PropTypes.object,
    endpointStore: PropTypes.object,
  }

  static getStores() {
    return [UserStore, ProjectStore, MigrationStore, EndpointStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      projectStore: ProjectStore.getState(),
      migrationStore: MigrationStore.getState(),
      endpointStore: EndpointStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      showDeleteMigrationConfirmation: false,
      confirmationItems: null,
    }
  }

  componentDidMount() {
    document.title = 'Coriolis Migrations'

    ProjectActions.getProjects()
    EndpointActions.getEndpoints()
    MigrationActions.getMigrations()
  }

  handleProjectChange(project) {
    Wait.for(() => this.props.userStore.user.project.id === project.id, () => {
      ProjectActions.getProjects()
      EndpointActions.getEndpoints()
      MigrationActions.getMigrations()
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
    ProjectActions.getProjects()
    EndpointActions.getEndpoints()
    MigrationActions.getMigrations()
  }

  handleItemClick(item) {
    window.location.href = `/#/migration/${item.id}`
  }

  handleActionChange(items, action) {
    if (action === 'cancel') {
      items.forEach(migration => {
        MigrationActions.cancel(migration.id)
      })
      NotificationActions.notify('Canceling migrations')
    } else if (action === 'delete') {
      this.setState({
        showDeleteMigrationConfirmation: true,
        confirmationItems: items,
      })
    }
  }

  handleCloseDeleteMigrationConfirmation() {
    this.setState({
      showDeleteMigrationConfirmation: false,
      confirmationItems: null,
    })
  }

  handleDeleteMigrationConfirmation() {
    this.state.confirmationItems.forEach(migration => {
      MigrationActions.delete(migration.id)
    })
    this.handleCloseDeleteMigrationConfirmation()
  }

  render() {
    return (
      <Wrapper>
        <MainTemplate
          navigationComponent={<Navigation currentPage="migrations" />}
          listComponent={
            <FilterList
              type="migration"
              itemImage={migrationItemImage}
              loading={this.props.migrationStore.loading}
              items={this.props.migrationStore.migrations}
              endpoints={this.props.endpointStore.endpoints}
              onItemClick={item => { this.handleItemClick(item) }}
              onReloadButtonClick={() => { this.handleReloadButtonClick() }}
              actions={BulkActions}
              onActionChange={(items, action) => { this.handleActionChange(items, action) }}
            />
          }
          headerComponent={
            <PageHeader
              title="Coriolis Migrations"
              projects={this.props.projectStore.projects}
              onProjectChange={project => { this.handleProjectChange(project) }}
              user={this.props.userStore.user}
              onUserItemClick={item => { this.handleUserItemClick(item) }}
            />
          }
        />
        <ConfirmationModal
          isOpen={this.state.showDeleteMigrationConfirmation}
          title="Delete Migrations?"
          message="Are you sure you want to delete the selected migrations?"
          extraMessage="Deleting a Coriolis Migration is permanent!"
          onConfirmation={() => { this.handleDeleteMigrationConfirmation() }}
          onRequestClose={() => { this.handleCloseDeleteMigrationConfirmation() }}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(MigrationsPage)
