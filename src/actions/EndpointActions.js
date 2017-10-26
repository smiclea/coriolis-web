import alt from '../alt'

import EndpointSource from '../sources/EndpointSource'

class EndpointActions {
  getEndpoints() {
    EndpointSource.getEndpoints().then(
      this.getEndpointsCompleted.bind(this),
      this.getEndpointsFailed.bind(this)
    ).catch(this.getEndpointsFailed.bind(this))

    return true
  }

  getEndpointsCompleted(response) {
    return response || true
  }

  getEndpointsFailed(response) {
    return response || true
  }

  delete(endpoint) {
    EndpointSource.delete(endpoint).then(
      () => { this.deleteSuccess(endpoint.id) },
      response => { this.deleteFailed(response) },
    )
    return endpoint
  }

  deleteSuccess(endpointId) {
    return endpointId
  }

  deleteFailed(response) {
    return response || true
  }

  getConnectionInfo(endpoint) {
    EndpointSource.getConnectionInfo(endpoint).then(
      connectionInfo => { this.getConnectionInfoSuccess(connectionInfo) },
      response => { this.getConnectionInfoFailed(response) },
    )
    return endpoint
  }

  getConnectionInfoSuccess(connectionInfo) {
    return connectionInfo
  }

  getConnectionInfoFailed(response) {
    return response || true
  }
}

export default alt.createActions(EndpointActions)
