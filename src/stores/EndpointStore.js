import alt from '../alt'
import EndpointActions from '../actions/EndpointActions'

class EndpointStore {
  constructor() {
    this.endpoints = []
    this.loading = false

    this.bindListeners({
      handleGetEndpoints: EndpointActions.GET_ENDPOINTS,
      handleGetEndpointsCompleted: EndpointActions.GET_ENDPOINTS_COMPLETED,
      handleGetEndpointsFailed: EndpointActions.GET_ENDPOINTS_FAILED,
      handleDeleteSuccess: EndpointActions.DELETE_SUCCESS,
    })
  }

  handleGetEndpoints() {
    this.loading = true
  }

  handleGetEndpointsCompleted(endpoints) {
    this.endpoints = endpoints
    this.loading = false
  }

  handleGetEndpointsFailed() {
    this.loading = false
  }

  handleDeleteSuccess(endpointId) {
    this.endpoints = this.endpoints.filter(e => e.id !== endpointId)
  }
}

export default alt.createStore(EndpointStore)
