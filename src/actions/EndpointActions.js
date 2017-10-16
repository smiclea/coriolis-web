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
}

export default alt.createActions(EndpointActions)
