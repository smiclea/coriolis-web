import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import { MainTemplate, Navigation, FilterList, PageHeader, EndpointListItem } from 'components'

import ProjectStore from '../../../stores/ProjectStore'
import UserStore from '../../../stores/UserStore'
import EndpointStore from '../../../stores/EndpointStore'
import ProjectActions from '../../../actions/ProjectActions'
import EndpointActions from '../../../actions/EndpointActions'
import UserActions from '../../../actions/UserActions'
import Wait from '../../../utils/Wait'

const Wrapper = styled.div``

const BulkActions = [
  { label: 'Execute', value: 'execute' },
  { label: 'Delete', value: 'delete' },
]

class EndpointsPage extends React.Component {
  static propTypes = {
    projectStore: PropTypes.object,
    userStore: PropTypes.object,
    endpointStore: PropTypes.object,
  }

  static getStores() {
    return [UserStore, ProjectStore, EndpointStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      projectStore: ProjectStore.getState(),
      endpointStore: EndpointStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      showDeleteEndpointsConfirmation: false,
      confirmationItems: null,
    }
  }

  componentDidMount() {
    document.title = 'Coriolis Endpoints'

    ProjectActions.getProjects()
    EndpointActions.getEndpoints()
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }

  handleProjectChange(project) {
    Wait.for(() => this.props.userStore.user.project.id === project.id, () => {
      ProjectActions.getProjects()
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
    ProjectActions.getProjects()
    EndpointActions.getEndpoints()
  }

  handleItemClick(item) {
    window.location.href = `/#/endpoints/${item.id}`
  }

  handleActionChange(items, action) {
    if (action === 'delete') {
      this.setState({
        showDeleteEndpointsConfirmation: true,
        confirmationItems: items,
      })
    }
  }

  handleCloseDeleteEndpointsConfirmation() {
    this.setState({
      showDeleteEndpointsConfirmation: false,
      confirmationItems: null,
    })
  }

  handleDeleteEndpointsConfirmation() {
    this.state.confirmationItems.forEach(endpoint => {
      EndpointActions.delete(endpoint.id)
    })
    this.handleCloseDeleteEndpointsConfirmation()
  }

  itemFilterFunction(item, filterStatus, filterText) {
    return true
  }

  render() {
    return (
      <Wrapper>
        <MainTemplate
          navigationComponent={<Navigation currentPage="endpoints" />}
          listComponent={
            <FilterList
              selectionLabel="migration"
              loading={this.props.endpointStore.loading}
              items={this.props.endpointStore.endpoints}
              onItemClick={item => { this.handleItemClick(item) }}
              onReloadButtonClick={() => { this.handleReloadButtonClick() }}
              actions={BulkActions}
              onActionChange={(items, action) => { this.handleActionChange(items, action) }}
              itemFilterFunction={(...args) => this.itemFilterFunction(...args)}
              renderItemComponent={options =>
                (<EndpointListItem {...options} />)
              }
            />
          }
          headerComponent={
            <PageHeader
              title="Coriolis Endpoints"
              projects={this.props.projectStore.projects}
              onProjectChange={project => { this.handleProjectChange(project) }}
              user={this.props.userStore.user}
              onUserItemClick={item => { this.handleUserItemClick(item) }}
            />
          }
        />
      </Wrapper>
    )
  }
}

export default connectToStores(EndpointsPage)
