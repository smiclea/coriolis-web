import alt from '../alt'

import EndpointSource from '../sources/EndpointSource'

class EndpointActions {
  getEndpoints() {
    EndpointSource.getEndpoints().then(
      endpoints => { this.getEndpointsCompleted(endpoints) },
      response => { this.getEndpointsFailed(response) }
    )

    return true
  }

  getEndpointsCompleted(endpoints) {
    return endpoints
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
    return endpoint || true
  }

  getConnectionInfoSuccess(connectionInfo) {
    return connectionInfo
  }

  getConnectionInfoFailed(response) {
    return response || true
  }

  validate(endpoint) {
    EndpointSource.validate(endpoint).then(
      validation => { this.validateSuccess(validation) },
      response => { this.validateFailed(response) },
    )
    return endpoint
  }

  validateSuccess(validation) {
    return validation
  }

  validateFailed(response) {
    return response || true
  }

  clearValidation() {
    return true
  }

  update(endpoint) {
    EndpointSource.update(endpoint).then(
      endpointResponse => { this.updateSuccess(endpointResponse) },
      response => { this.updateFailed(response) },
    )

    return endpoint
  }

  updateSuccess(endpoint) {
    return endpoint
  }

  updateFailed(response) {
    return response || true
  }

  clearConnectionInfo() {
    return true
  }

  add(endpoint) {
    EndpointSource.add(endpoint).then(
      endpointResponse => { this.addSuccess(endpointResponse) },
      response => { this.addFailed(response) },
    )

    return endpoint
  }

  addSuccess(endpoint) {
    return endpoint
  }

  addFailed(response) {
    return response || true
  }
}

export default alt.createActions(EndpointActions)
