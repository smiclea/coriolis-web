import alt from '../alt'
import EndpointActions from '../actions/EndpointActions'

class EndpointStore {
  constructor() {
    this.endpoints = []
    this.loading = false
    this.connectionInfo = null
    this.validationLoading = true
    this.validation = null

    this.bindListeners({
      handleGetEndpoints: EndpointActions.GET_ENDPOINTS,
      handleGetEndpointsCompleted: EndpointActions.GET_ENDPOINTS_COMPLETED,
      handleGetEndpointsFailed: EndpointActions.GET_ENDPOINTS_FAILED,
      handleDeleteSuccess: EndpointActions.DELETE_SUCCESS,
      handleGetConnectionInfoSuccess: EndpointActions.GET_CONNECTION_INFO_SUCCESS,
      handleValidate: EndpointActions.VALIDATE,
      handleValidateSuccess: EndpointActions.VALIDATE_SUCCESS,
      handleValidateFailed: EndpointActions.VALIDATE_FAILED,
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

  handleGetConnectionInfoSuccess(connectionInfo) {
    this.connectionInfo = connectionInfo
  }

  handleValidate() {
    this.validationLoading = true
  }

  handleValidateSuccess(validation) {
    this.validation = validation
    this.validationLoading = false
  }

  handleValidateFailed() {
    this.validationLoading = false
    this.validation = { valid: false }
  }
}

export default alt.createStore(EndpointStore)
