import React from 'react'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import { DetailsTemplate, DetailsPageHeader, DetailsContentHeader } from 'components'

import Wait from '../../../utils/Wait'
import ReplicaStore from '../../../stores/ReplicaStore'
import UserStore from '../../../stores/UserStore'
import UserActions from '../../../actions/UserActions'
import ReplicaActions from '../../../actions/ReplicaActions'
import EndpointStore from '../../../stores/EndpointStore'
import EndpointActions from '../../../actions/EndpointActions'

import replicaImage from './images/replica.svg'

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

  componentDidMount() {
    document.title = 'Replica Details'

    if (this.props.replicaStore.replicaDetails.id !== this.props.match.params.id) {
      ReplicaActions.getReplica(this.props.match.params.id)
    }

    Wait.for(() => this.props.replicaStore.replicaDetails.id === this.props.match.params.id, () => {
      ReplicaActions.loadReplicaExecutions(this.props.replicaStore.replicaDetails.id)
    })

    if (this.props.endpointStore.endpoints.length === 0) {
      EndpointActions.getEndpoints()
    }
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

  render() {
    return (
      <DetailsTemplate
        pageHeaderComponent={<DetailsPageHeader
          user={this.props.userStore.user}
          onUserItemClick={item => { this.handleUserItemClick(item) }}
        />}
        contentHeaderComponent={<DetailsContentHeader
          item={this.props.replicaStore.replicaDetails}
          onBackButonClick={() => { this.handleBackButtonClick() }}
          typeImage={replicaImage}
          alertInfoPill
          buttonLabel="Execute Now"
        />}
        contentComponent={<div>Content</div>}
      />
    )
  }
}

export default connectToStores(ReplicaDetailsPage)
