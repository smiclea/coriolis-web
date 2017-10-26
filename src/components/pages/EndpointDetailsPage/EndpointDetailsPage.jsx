import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import {
  DetailsTemplate,
  DetailsPageHeader,
  DetailsContentHeader,
  EndpointDetailsContent,
  ConfirmationModal,
} from 'components'

import EndpointStore from '../../../stores/EndpointStore'
import EndpointActions from '../../../actions/EndpointActions'
import UserStore from '../../../stores/UserStore'
import UserActions from '../../../actions/UserActions'
import Wait from '../../../utils/Wait'

import endpointImage from './images/endpoint.svg'

const Wrapper = styled.div``

class EndpointDetailsPage extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    endpointStore: PropTypes.object,
    userStore: PropTypes.object,
  }

  static getStores() {
    return [EndpointStore, UserStore]
  }

  static getPropsFromStores() {
    return {
      endpointStore: EndpointStore.getState(),
      userStore: UserStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      showDeleteEndpointConfirmation: false,
    }
  }

  componentDidMount() {
    document.title = 'Endpoint Details'

    this.loadData()
  }

  getEndpoint() {
    return this.props.endpointStore.endpoints.find(e => e.id === this.props.match.params.id) || {}
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
    window.location.href = '/#/endpoints'
  }

  handleDeleteEndpointClick() {
    this.setState({ showDeleteEndpointConfirmation: true })
  }

  handleDeleteEndpointConfirmation() {
    window.location.href = '/#/endpoints'
    EndpointActions.delete(this.getEndpoint())
  }

  handleCloseDeleteEndpointConfirmation() {
    this.setState({ showDeleteEndpointConfirmation: false })
  }

  loadData() {
    EndpointActions.getEndpoints()

    Wait.for(() => this.getEndpoint().id, () => {
      let endpoint = this.getEndpoint()

      if (endpoint.connection_info && endpoint.connection_info.secret_ref) {
        EndpointActions.getConnectionInfo(endpoint)
      } else {
        EndpointActions.getConnectionInfoSuccess(endpoint.connection_info)
      }
    })
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
            item={this.getEndpoint()}
            onBackButonClick={() => { this.handleBackButtonClick() }}
            typeImage={endpointImage}
            description={this.getEndpoint().description}
          />}
          contentComponent={<EndpointDetailsContent
            item={this.getEndpoint()}
            connectionInfo={this.props.endpointStore.connectionInfo}
            onDeleteClick={() => { this.handleDeleteEndpointClick() }}
          />}
        />
        <ConfirmationModal
          isOpen={this.state.showDeleteEndpointConfirmation}
          title="Delete Endpoint?"
          message="Are you sure you want to delete this endpoint?"
          extraMessage="Deleting a Coriolis Endpoint is permanent!"
          onConfirmation={() => { this.handleDeleteEndpointConfirmation() }}
          onRequestClose={() => { this.handleCloseDeleteEndpointConfirmation() }}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(EndpointDetailsPage)
